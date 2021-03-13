TS="(date +"%T")"
sed -i "s/?timestamp=\d+/?timestamp={$TS}/g" rungolf.html
git add -A; git commit -m '2'; git push