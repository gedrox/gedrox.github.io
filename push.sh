TS=`(date +"%s")`
sed "s/timestamp=/timestamp=$TS/g" rungolf-test.html | sed "s/script-test.js/script.js/g" > rungolf.html
sed "s/test = true/test = false/g" script-test.js > script.js

git add -A; git commit -m '2'; git push