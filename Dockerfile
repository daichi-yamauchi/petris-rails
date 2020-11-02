FROM ruby:2.7.2
RUN export APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1 && \
  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
  apt-get update && apt-get install -y \
  build-essential \
  libpq-dev \
  node.js \
  postgresql-client \
  yarn
WORKDIR /petris
COPY Gemfile /petris/
RUN bundle install

ARG UID
ARG UNAME
ARG GID
ARG GNAME

RUN groupadd -g ${GID} ${GNAME} && \
  useradd -u ${UID} -g ${GID} ${UNAME} && \
  mkdir /home/${UNAME} && \
  chown ${UNAME} /home/${UNAME}
USER ${UID}