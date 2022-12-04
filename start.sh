dockerMongo="docker start c7445e90b472 && docker exec -it c7445e90b472 mongosh"

UserDbService="cd back-end/core/db/UsersDbService && npm run dev"
NodesDbService="cd back-end/core/db/NodesDbService && npm run dev"

ApiGateway="cd back-end/core/bussiness/APIGateway && npm run dev"
UserBussiness="cd back-end/core/bussiness/UserBusiness && npm run dev"
DeploymentBusiness="cd back-end/core/bussiness/DeploymentBusiness && npm run dev"

gnome-terminal --geometry=260x25-0+0 \
--tab -t "Docker Mongo" -e "bash -c '$dockerMongo'" \
--tab -t "User Db Serivice" -e "bash -c '$UserDbService'" \
--tab -t "Node Db Service" -e "bash -c '$NodesDbService'" \
--tab -t "Api Gateway" -e "bash -c '$ApiGateway'" \
--tab -t "User Bussiness" -e "bash -c '$UserBussiness'" \
--tab -t "Deployment Business" -e "bash -c '$DeploymentBusiness'"

