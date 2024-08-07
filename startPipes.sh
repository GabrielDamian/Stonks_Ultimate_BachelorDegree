# python3 ./start_shell.py

# Porneste containerele create de utilizatori
node ./utilitar/index.js start # TEST

echo "Wait for Kafka to initialize (20s)"
# sleep 20
# Pipe Nodes
nodePath="back-end/core/bussiness/DeploymentPipes"
genericNode="./env/bin/python3 ./Generic_Node.py " 

# Balancer (1 Pipe)
pipesBalancer="cd $nodePath && ./env/bin/python3 ./Balancer.py pipe_1_stage_1; bash"
node_1="cd $nodePath && $genericNode stage_1 pipe_1_stage_1 pipe_1_stage_2 stage_1 balancer-releaser; bash"
node_2="cd $nodePath && $genericNode stage_2 pipe_1_stage_2 pipe_1_stage_3 stage_2 balancer-releaser; bash"
node_3="cd $nodePath && $genericNode stage_3 pipe_1_stage_3 pipe_1_stage_4 stage_3 balancer-releaser; bash"
node_4="cd $nodePath && $genericNode stage_4 pipe_1_stage_4 pipe_1_stage_5 stage_4 balancer-releaser; bash"
node_5="cd $nodePath && $genericNode stage_5 pipe_1_stage_5 balancer-releaser stage_5 balancer-releaser; bash"

gnome-terminal --geometry=260x25-0+0 \
--tab -t "Pipes Balancer" -e "bash -c '$pipesBalancer'" \
--tab -t "Node_1" -e "bash -c '$node_1'" \
--tab -t "Node_2" -e "bash -c '$node_2'" \
--tab -t "Node_3" -e "bash -c '$node_3'" \
--tab -t "Node_4" -e "bash -c '$node_4'" \
--tab -t "Node_5" -e "bash -c '$node_5'"


# Balancer (2 Pipes)--------------
# pipesBalancer="cd $nodePath && ./env/bin/python3 ./Balancer.py pipe_1_stage_1 pipe_2_stage_1"
# node_1="cd $nodePath && $genericNode stage_1 pipe_1_stage_1 pipe_1_stage_2 stage_1 balancer-releaser"
# node_2="cd $nodePath && $genericNode stage_2 pipe_1_stage_2 pipe_1_stage_3 stage_2 balancer-releaser"
# node_3="cd $nodePath && $genericNode stage_3 pipe_1_stage_3 pipe_1_stage_4 stage_3 balancer-releaser"
# node_4="cd $nodePath && $genericNode stage_4 pipe_1_stage_4 pipe_1_stage_5 stage_4 balancer-releaser"
# node_5="cd $nodePath && $genericNode stage_5 pipe_1_stage_5 balancer-releaser stage_5 balancer-releaser"

# node_1_prim="cd $nodePath && $genericNode stage_1_p pipe_2_stage_1 pipe_2_stage_2 stage_1 balancer-releaser"
# node_2_prim="cd $nodePath && $genericNode stage_2_p pipe_2_stage_2 pipe_2_stage_3 stage_2 balancer-releaser"
# node_3_prim="cd $nodePath && $genericNode stage_3_p pipe_2_stage_3 pipe_2_stage_4 stage_3 balancer-releaser"
# node_4_prim="cd $nodePath && $genericNode stage_4_p pipe_2_stage_4 pipe_2_stage_5 stage_4 balancer-releaser"
# node_5_prim="cd $nodePath && $genericNode stage_5_p pipe_2_stage_5 balancer-releaser stage_5 balancer-releaser"


# gnome-terminal --geometry=260x25-0+0 \
# --tab -t "Pipes Balancer" -e "bash -c '$pipesBalancer'" \
# --tab -t "Node_1" -e "bash -c '$node_1'" \
# --tab -t "Node_2" -e "bash -c '$node_2'" \
# --tab -t "Node_3" -e "bash -c '$node_3'" \
# --tab -t "Node_4" -e "bash -c '$node_4'" \
# --tab -t "Node_5" -e "bash -c '$node_5'" \
# --tab -t "Node_1_p" -e "bash -c '$node_1_prim'" \
# --tab -t "Node_2_p" -e "bash -c '$node_2_prim'" \
# --tab -t "Node_3_p" -e "bash -c '$node_3_prim'" \
# --tab -t "Node_4_p" -e "bash -c '$node_4_prim'" \
# --tab -t "Node_5_p" -e "bash -c '$node_5_prim'" \


