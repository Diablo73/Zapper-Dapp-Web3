# git pull origin master
echo "START"
echo
# {
# 	nginx -p /home/runner/$REPL_SLUG/ -e logs/nginx.log -c resources/nginx/nginx.conf -g 'daemon off;'
# } &
{
	cd backend/ && npm run start
} & 
{
	cd frontend/ && npm run start
}