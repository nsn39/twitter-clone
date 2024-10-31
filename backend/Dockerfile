FROM  python:latest
LABEL maintainer='heyitsnishan2020@gmail.com'
# --platform=linux/x86_64
RUN apt-get -y update && \
    apt-get install -y gcc python3-dev libpq-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt requirements.txt
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

RUN adduser --disabled-password --gecos '' backend

WORKDIR /app

COPY . /app

RUN chmod u+x run.sh

#EXPOSE 8000

USER backend

ENV PYTHONPATH=/app

ENTRYPOINT [ "./run.sh" ]