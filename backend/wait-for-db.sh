#!/usr/bin/env bash
set -e

if [ "$#" -lt 3 ]; then
  echo "Usage: $0 host port command [args...]"
  exit 1
fi

host="$1"
port="$2"
shift 2

until mysqladmin ping -h "$host" -P "$port" -uroot -prootpass --silent; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is available - starting backend"
exec "$@"
