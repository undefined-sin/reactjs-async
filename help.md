Fix spaces / tabs:
find src -name '*.js' ! -type d -exec bash -c 'expand -t 4 "$0" > /tmp/e && mv /tmp/e "$0"' {} \;

Logo:
https://logomakr.com/4y1YEL