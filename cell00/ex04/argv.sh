#!/bin/sh
if [ $# -eq 0 ]; then
    echo "No arguments supplied"
else
    for arg in "$@"; do
        echo "$arg"
    done | head -n 3
fi
