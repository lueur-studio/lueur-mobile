#!/bin/bash

echo "Docker Manager"
echo "=============="
echo "1) Rebuild everything (down + build + up)"
echo "2) Stop containers (down)"
echo "3) Start normally (up -d)"
echo "4) Enter a container"
echo -n "Enter choice (1/2/3/4): "
read choice

case $choice in

  1)
    echo "Rebuilding everything..."
    docker compose down
    docker compose build --no-cache
    docker compose up -d
    echo "Rebuild complete!"
    ;;

  2)
    echo "Stopping containers..."
    docker compose down
    echo "Stopped."
    ;;

  3)
    echo "Starting containers..."
    docker compose up -d
    echo "Started!"
    ;;

  4)
    echo "Available containers:"
    docker ps --format "table {{.Names}}\t{{.Image}}"
    echo -n "Enter container name: "
    read container

    if [ "$container" == "lueur-mysql" ]; then
        echo "Opening MySQL CLI in $container..."
        docker exec -it "$container" mysql -u root -p
    elif [ "$container" == "lueur-api" ]; then
        echo "Opening shell in $container..."
        docker exec -it "$container" sh
    else
        echo "Unknown container. Exiting."
        exit 1
    fi
    ;;

  *)
    echo "Invalid choice. Exiting."
    exit 1
    ;;

esac
