#!/bin/bash
cd frontend/
npm run build
cp -r build/. ../nginx/build