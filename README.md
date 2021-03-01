# prosperamdb

An example of scalable (both vertically & horizontally) and deployable movies DB web app.

## Live demo

Frontend: https://prosperamdb.sergeylukin.com/

Backend: https://prosperamdb-backend.sergeylukin.com/admin (contact
[@sergeylukin](https://github.com/sergeylukin) for credentials)

## Staging

Stagin environment is auto-generated (copy of production cluster including all
services) for each PR

# Deployment

One command to production deployment (including infra): `git push`

We use [Render](https://render.com) as our cloud provider.

The fleet can be found in `render.yaml`, which can be modified for both
vertical (CPU and RAM) as well as horizontal (number of instances) scale.
Currently backend service is running 2 instances for demo purposes.

# Development

One command development setup: `docker-compose up`

We use `docker-compose` to manage our fleet locally (it's identical to
production and staging environments, read more in [deployment section](https://github.com/sergeylukin/prosperamdb#deployment)).

Install [Docker](https://docs.docker.com/get-docker/) to get started.

Add prosperamdb-backend DNS to your `hostname` file (`/etc/hostname` in OS X):

```
0.0.0.0 prosperamdb-backend
```

Set environment variables:

```sh
cp .env.example .env # sane defaults in place
```

Rock'n roll (will take a few mins at first, see below on how to watch the progress):

```
docker-compose up
```

`Ctrl + c` exits and stops all instances, just `docker-compose up` to resume

Resets the whole thing (delete instances, images, etc.):

```
docker-compose down --rmi all -v
```

To manage backend `NPM` dependencies, use `npm` straight inside container:

```
docker exec -it prosperamdb-backend /bin/bash
# npm install --save ...
```

Similarly, manage frontend dependencies:

```
docker exec -it prosperamdb-frontend /bin/bash
# npm install --save ...
```

...return to host machine and commit your changes regularly

### Debugging, logging

First of all, see your containers running:

```
docker ps
```

To access a node directly, use one of following:

```
docker exec -it prosperamdb-frontend /bin/bash
```

```
docker exec -it prosperamdb-backend /bin/bash
```

```
docker exec -it prosperamdb-postgres /bin/bash
```

While inside shell, see the processes:

```
$ ps -ef
```

To see the logs, use any of these:

```
docker-compose logs --tail=all -f | grep prosperamdb-frontend
```

```
docker-compose logs --tail=all -f | grep prosperamdb-backend
```

```
docker-compose logs --tail=all -f | grep prosperamdb-postgres
```

# Credits

Technologies used:

- [Strapi](https://strapi.io/) for backend + API
- [Gatsby](https://www.gatsbyjs.com/) for frontend
- [Theme-UI](https://theme-ui.com/) + [Emotion](https://emotion.sh/) for CSS-in-JS styling
- [Render](https://render.com/) as cloud platform with super powers
- [VIM](https://www.vim.org/) as one of the most configurable and lightest IDEs out there
