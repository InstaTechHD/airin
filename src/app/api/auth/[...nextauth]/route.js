import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/mongodb/db";
import { getServerSession } from "next-auth";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    {
      id: "AniListProvider",
      name: "AniList",
      type: "oauth",
      token: "https://anilist.co/api/v2/oauth/token",
      authorization: {
        url: "https://anilist.co/api/v2/oauth/authorize",
        params: { scope: "", response_type: "code" },
      },
      userinfo: {
        url: process.env.GRAPHQL_ENDPOINT,
        async request(context) {
          const { data } = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${context.tokens.access_token}`,
              Accept: "application/json",
            },
            body: JSON.stringify({
              query: `
                query {
                  Viewer {
                    id
                    name
                    avatar {
                      large
                      medium
                    }
                    bannerImage
                    createdAt
                    mediaListOptions {
                      animeList {
                        customLists
                      }
                    }
                  }
                }
              `,
            }),
          }).then((res) => res.json());
          
          console.log('AniList user data:', data); // Log AniList user data

          const userLists = data.Viewer?.mediaListOptions.animeList.customLists;
          let customLists = userLists || [];

          if (!userLists?.includes("Watched Via Airin")) {
            customLists.push("Watched Via Airin");
            const fetchGraphQL = async (query, variables) => {
              const response = await fetch("https://graphql.anilist.co/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...(context.tokens.access_token && {
                    Authorization: `Bearer ${context.tokens.access_token}`,
                  }),
                  Accept: "application/json",
                },
                body: JSON.stringify({ query, variables }),
              });
              return response.json();
            };

            const modifiedLists = async (lists) => {
              const setList = `
                mutation($lists: [String]){
                  UpdateUser(animeListOptions: { customLists: $lists }){
                    id
                  }
                }
              `;
              const data = await fetchGraphQL(setList, { lists });
              return data;
            };

            await modifiedLists(customLists);
          }

          return {
            token: context.tokens.access_token,
            name: data.Viewer.name,
            sub: data.Viewer.id,
            image: data.Viewer.avatar,
            createdAt: data.Viewer.createdAt,
            list: data.Viewer?.mediaListOptions.animeList.customLists,
          };
        },
      },
      clientId: process.env.ANILIST_CLIENT_ID,
      clientSecret: process.env.ANILIST_CLIENT_SECRET,
      profile(profile) {
        return {
          token: profile.token,
          id: profile.sub,
          name: profile?.name,
          image: profile.image,
          createdAt: profile?.createdAt,
          list: profile?.list,
        };
      },
    },
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback - token:', token); // Log JWT token
      console.log('JWT callback - user:', user); // Log user data
      return { ...token, ...user };
    },
    async session({ session, token }) {
      console.log('Session callback - session:', session); // Log session data
      console.log('Session callback - token:', token); // Log token data
      session.user = token;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export const getAuthSession = () => getServerSession(authOptions);

export { handler as GET, handler as POST };
