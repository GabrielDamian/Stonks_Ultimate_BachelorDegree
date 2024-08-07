dockerMongo="docker start c8b2cdd84f9f && docker exec -it c8b2cdd84f9f mongosh"

UserDbService="cd back-end/core/db/UsersDbService && npm run dev"
NodesDbService="cd back-end/core/db/NodesDbService && npm run dev"

ApiGateway="cd back-end/core/bussiness/APIGateway && npm run dev"
UserBussiness="cd back-end/core/bussiness/UserBusiness && npm run dev"
DeploymentBusiness="cd back-end/core/bussiness/DeploymentBusiness && npm run dev"
NodesBusiness="cd back-end/core/bussiness/NodesBusiness && npm run dev"

ReactApp="cd front-end && npm run start"

gnome-terminal --geometry=260x25-0+0 \
--tab -t "Docker Mongo" -e "bash -c '$dockerMongo'" \
--tab -t "User Db Serivice" -e "bash -c '$UserDbService'" \
--tab -t "Node Db Service" -e "bash -c '$NodesDbService'" \
--tab -t "Api Gateway" -e "bash -c '$ApiGateway'" \
--tab -t "User Bussiness" -e "bash -c '$UserBussiness'" \
--tab -t "Deployment Business" -e "bash -c '$DeploymentBusiness'" \
--tab -t "Nodes Business" -e "bash -c '$NodesBusiness'" \
--tab -t "React App" -e "bash -c '$ReactApp'"

# Start Zookeeper and Kafka
# to do: check exit code and exit from main script in case of failure
# python3 ./start_shell.py

# echo "Wait for Kafka to initialize (20s)"
# sleep 20
# # Pipe Nodes
nodePath="back-end/core/bussiness/DeploymentPipes"
genericNode="./env/bin/python3 ./Generic_Node.py"

# Balancer
pipesBalancer="cd $nodePath && ./env/bin/python3 ./Balancer.py; exec bash"
# cd back-end/core/bussiness/DeploymentPipes && ./env/bin/python3 ./Balancer.py; exec bash

node_1="cd $nodePath && $genericNode stage_1 pipe_1_stage_1 pipe_1_stage_2 stage_1; exec bash"
# cd back-end/core/bussiness/DeploymentPipes && ./env/bin/python3 ./Generic_Node.py stage_1 pipe_1_stage_1 pipe_1_stage_2 stage_1; exec bash

node_2="cd $nodePath && $genericNode stage_2 pipe_1_stage_2 pipe_1_stage_3 stage_2; exec bash"
node_3="cd $nodePath && $genericNode stage_3 pipe_1_stage_3 pipe_1_stage_4 stage_3; exec bash"
node_4="cd $nodePath && $genericNode stage_4 pipe_1_stage_4 pipe_1_stage_5 stage_4; exec bash"
node_5="cd $nodePath && $genericNode stage_5 pipe_1_stage_5 balancer-releaser stage_5; exec bash"

gnome-terminal --geometry=260x25-0+0 \
--tab -t "Pipes Balancer" -e "bash -c '$pipesBalancer'" \
--tab -t "Node_1" -e "bash -c '$node_1'" \
--tab -t "Node_2" -e "bash -c '$node_2'" \
--tab -t "Node_3" -e "bash -c '$node_3'" \
--tab -t "Node_4" -e "bash -c '$node_4'" \
--tab -t "Node_5" -e "bash -c '$node_5'"


