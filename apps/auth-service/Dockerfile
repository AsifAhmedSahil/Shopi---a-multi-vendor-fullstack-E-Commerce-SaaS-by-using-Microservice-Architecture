# This file is generated by Nx.
#
# Build the docker image with `npx nx docker-build @shopi/auth-service`.
# Tip: Modify "docker-build" options in project.json to change docker build args.
#
# Run the container with `docker run -p 3000:3000 -t @shopi/auth-service`.
FROM docker.io/node:lts-alpine

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN addgroup --system @shopi/auth-service && \
          adduser --system -G @shopi/auth-service @shopi/auth-service

COPY apps/auth-service/dist @shopi/auth-service/
RUN chown -R @shopi/auth-service:@shopi/auth-service .

# You can remove this install step if you build with `--bundle` option.
# The bundled output will include external dependencies.
RUN npm --prefix @shopi/auth-service --omit=dev -f install

CMD [ "node", "@shopi/auth-service" ]
