dockerMongo="docker start c8b2cdd84f9f && docker exec -it c8b2cdd84f9f mongosh"

UserDbService="cd back-end/core/db/UsersDbService && npm run dev"
NodesDbService="cd back-end/core/db/NodesDbService && npm run dev"
LayersDbService="cd back-end/core/db/LayersDbService && npm run dev"

ApiGateway="cd back-end/core/bussiness/APIGateway && npm run dev"
UserBussiness="cd back-end/core/bussiness/UserBusiness && npm run dev"
DeploymentBusiness="cd back-end/core/bussiness/DeploymentBusiness && npm run dev"
NodesBusiness="cd back-end/core/bussiness/NodesBusiness && npm run dev"
LayersBusiness="cd back-end/core/bussiness/LayersBusiness && npm run dev"

ReactApp="cd front-end && npm run start"

gnome-terminal --geometry=260x25-0+0 \
--tab -t "Docker Mongo" -e "bash -c '$dockerMongo'" \
--tab -t "User Db Serivice" -e "bash -c '$UserDbService'" \
--tab -t "Node Db Service" -e "bash -c '$NodesDbService'" \
--tab -t "Layers Db Service" -e "bash -c '$LayersDbService'" \
--tab -t "User Bussiness" -e "bash -c '$UserBussiness'" \
--tab -t "Deployment Business" -e "bash -c '$DeploymentBusiness'" \
--tab -t "Nodes Business" -e "bash -c '$NodesBusiness'" \
--tab -t "Layers Business" -e "bash -c '$LayersBusiness'" \
--tab -t "React App" -e "bash -c '$ReactApp'" \
--tab -t "Api Gateway" -e "bash -c '$ApiGateway'" 






