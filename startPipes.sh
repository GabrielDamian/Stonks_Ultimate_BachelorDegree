python3 ./start_shell.py

echo "Wait for Kafka to initialize (20s)"
sleep 20
# Pipe Nodes
nodePath="back-end/core/bussiness/DeploymentPipes"
genericNode="./env/bin/python3 ./Generic_Node.py"

# Balancer
pipesBalancer="cd $nodePath && ./env/bin/python3 ./Balancer.py"

node_1="cd $nodePath && $genericNode stage_1 pipe_1_stage_1 pipe_1_stage_2 stage_1 balancer-releaser"
node_2="cd $nodePath && $genericNode stage_2 pipe_1_stage_2 pipe_1_stage_3 stage_2 balancer-releaser"
node_3="cd $nodePath && $genericNode stage_3 pipe_1_stage_3 pipe_1_stage_4 stage_3 balancer-releaser"
node_4="cd $nodePath && $genericNode stage_4 pipe_1_stage_4 pipe_1_stage_5 stage_4 balancer-releaser"
node_5="cd $nodePath && $genericNode stage_5 pipe_1_stage_5 balancer-releaser stage_5 balancer-releaser"

gnome-terminal --geometry=260x25-0+0 \
--tab -t "Pipes Balancer" -e "bash -c '$pipesBalancer'" \
--tab -t "Node_1" -e "bash -c '$node_1'" \
--tab -t "Node_2" -e "bash -c '$node_2'" \
--tab -t "Node_3" -e "bash -c '$node_3'" \
--tab -t "Node_4" -e "bash -c '$node_4'" \
--tab -t "Node_5" -e "bash -c '$node_5'"


