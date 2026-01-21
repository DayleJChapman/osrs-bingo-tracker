FROM oven/bun:1.3 AS base
ARG dir=/opt/osrs-bingo-tracker
ENV NODE_ENV=production

WORKDIR ${dir}

COPY package.json bun.lock ./
RUN bun install

COPY . .

RUN bun run db:migrate && \
  bun run db:seed

FROM oven/bun:1.3 AS release
ARG dir=/opt/osrs-bingo-tracker
ENV NODE_ENV=production
ENV PORT=3080
EXPOSE 3080/tcp

WORKDIR ${dir}

COPY --from=base ${dir}/ .

CMD [ "bun", "run", "src/index.ts" ]
