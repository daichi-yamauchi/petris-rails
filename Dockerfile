FROM ruby:2.5
RUN apt-get update && apt-get install -y \
  build-essential \
  libpq-dev \
  node.js \
  postgresql-client \
  yarn
RUN apt-get install -y sudo
WORKDIR /app
COPY Gemfile /app/
RUN bundle install

ARG UID
ARG UNAME
ARG GID
ARG GNAME

RUN groupadd -g ${GID} ${GNAME} && useradd -u ${UID} -g ${GID} ${UNAME}
USER ${UID}