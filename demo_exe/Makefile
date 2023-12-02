.PHONY: clean

run: build
	node ./dist/main.js

build: dist/main.js

dist/main.js: index.js
	npm run build

clean:
	rm -rf dist
