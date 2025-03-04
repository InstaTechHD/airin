<div align="center">
  <a href="https://makima.xyz" target="_blank">
    <img src="https://raw.githubusercontent.com/InstaTechHD/airin/refs/heads/master/public/avatar-(ProfilePictureMaker.com).png" alt="Logo" width="140" height="140">
  </a>

  <h2 align="center">Makima</h3>

  <p align="center">
    An open-source Anime streaming site built with Nextjs 14
  </p>
</div>


# About the Project

Enjoy ad-free streaming and seamless progress tracking with AniList integration, powered by Consumet API and Anify. Built with Next.js 14, Nextui, MongoDB, and Redis, our platform offers a smooth experience. Look out for hidden features - every clickable item may hold a different surprise.


## Features

- No ads
- Fast page load
- PWA supported
- Responsive on all devices
- Multi provider support
- Recommendations
- Player Features
  - Autoplay next episode
  - Skip op/ed button
  - Autoplay Video


<!-- ROADMAP -->
## Roadmap

- [X] Add Changelog
- [ ] Download episodes
- [ ] Add Comment section
- [ ] Create separate page for anilist users
    - [ ] To view their progress
    - [ ] Check all their details imported from anilist
- [ ] Add Scene Search in catalog page
- [X] Add Anilist episode tracking
- [ ] Complete Watch Page
- [X] Add Profile page.
- [ ] Add Manga Reading Support
    - [ ] Comick
    - [ ] Mangadex
    - [ ] And some more

See the [open issues](https://github.com/Noname968/airin/issues) for a full list of proposed features (and known issues).


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```
## Redis
# If you don't want to use redis leave it empty or comment it.
REDIS_URL="get redis from upstash, litegix or aiven. They offer free tier."

## AniList
GRAPHQL_ENDPOINT=https://graphql.anilist.co
ANILIST_CLIENT_ID="get your id from here https://anilist.co/settings/developer"
ANILIST_CLIENT_SECRET="get your secret from here https://anilist.co/settings/developer"

## NextAuth Details
NEXTAUTH_SECRET='run this command in your terminal (openssl rand -base64 32)'
NEXTAUTH_URL="for development use http://localhost:3000/ and for production use your domain url"

## NextJS
NEXT_PUBLIC_PROXY_URI="Use a proxy if u wish, not mandatory"

## Optional (Will work without this)
ZORO_URI="host your own API from this repo https://github.com/ghoshRitesh12/aniwatch-api. Don't put / at the end of the url."

## MongoDB
MONGODB_URI="Your Mongodb connection String"

## In AniList Developer console add redirect url :
# https://{your-domain}/api/auth/callback/AniListProvider

```


## Run Locally

Clone the project
```bash
  git clone https://github.com/InstaTechHD/airin.git
```

Go to the project directory
```bash
  cd airin
```

Install dependencies
```bash
  npm install
```

Start the server

```bash
  npm run dev
```

## Run using Docker

Get the .env.example file from the repo, edit it and then rename it to .env

Move the .env file somewhere it won't bother you (optional)

Run the image:
```bash
docker run -d -it \
--name airin \
-p 3000:3000 \
-v <path_of_env_file>/.env:/usr/src/app/.env \
ghcr.io/Noname968/airin:latest
```

For Docker Compose:
```yaml
version: "3.3"
services:
  airin:
    container_name: airin
    ports:
      - 3000:3000
    volumes:
      - <path_of_env_file>/.env:/usr/src/app/.env
    image: ghcr.io/Noname968/airin:latest
```

For at full stack deploy (db, redis, consumet api)
See [docker-compose.yml](https://github.com/Noname968/airin/blob/master/docker-compose.yml)

Access Airin at ``http://localhost:3000``

## Self-Hosting Notice

> [!CAUTION]
> Self-hosting this application is **strictly limited to personal use only**. Commercial utilization is **prohibited**, and the inclusion of advertisements on your self-hosted website may lead to serious consequences, including **potential site takedown measures**. Ensure compliance to avoid any legal or operational issues.


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- CONTACT -->
## Contact

Project Link: [https://github.com/Noname968/airin](https://github.com/Noname968/airin)

Discord Server: [https://discord.gg/QnbFaudJNf](https://discord.gg/QnbFaudJNf)

For any queries you can DM me on Discord `harsha9680`.
