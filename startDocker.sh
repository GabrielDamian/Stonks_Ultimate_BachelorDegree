dockerMongo="docker start c7445e90b472 && docker exec -it c7445e90b472 mongosh"
ReactApp="cd front-end && npm run start"
DeploymentBusiness="cd back-end/core/bussiness/DeploymentBusiness && npm run dev"

gnome-terminal --geometry=260x25-0+0 \
--tab -t "Docker Mongo" -e "bash -c '$dockerMongo'" \
--tab -t "React App" -e "bash -c '$ReactApp'" \
--tab -t "Deployment Business" -e "bash -c '$DeploymentBusiness'" \
--tab -t "Docker Compose" -e "bash -c 'docker-compose up'"

bash ./startPipes.sh




