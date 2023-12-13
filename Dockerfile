FROM ubuntu:latest
LABEL authors="Jax"

ENTRYPOINT ["top", "-b"]