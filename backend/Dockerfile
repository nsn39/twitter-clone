FROM python:3.14.0a1-slim-bookworm
LABEL maintainer='heyitsnishan2020@gmail.com'

WORKDIR /

RUN apt-get -y update && \
    apt-get install -y gcc python3-dev libpq-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

RUN chmod u+x /app/run.sh

EXPOSE 8000

ENV PYTHONPATH=/app

ENTRYPOINT [ "app/run.sh" ]