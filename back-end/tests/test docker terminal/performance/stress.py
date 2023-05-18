from locust import HttpUser, task, between
import random
import string

def generate_random_string(length):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for _ in range(length))

def generate_credentials():
    username = generate_random_string(8)
    email = generate_random_string(8) + "@example.com"
    password = generate_random_string(10)
    return [username, email, password]


token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNzk2N2ZjNWQzZGVlNGY0ZDZlYjgzMSIsImlhdCI6MTY4NDM1MTQ5NywiZXhwIjoxNjg0NjEwNjk3fQ.JLcMHTBcNSPzs43PquRfZgbQYbfvQzfdOIUziWIXEqU'

class MyUser(HttpUser):
    wait_time = between(0.5, 1)
    # base_url3="http://localhost:3002"

    # http://localhost:3006/fetch-node
    # @task
    # def test_node(self):
    #     headers = {'Content-Type': 'application/json'}
    #     cookies = {'jwt': token}
    #     node_ids = [
    #         '6463f7658cab1830f39d661c',
    #         '6463f6038cab18d3609d660b',
    #         '6463f3758cab18bb789d65fe',
    #         '6463f3418cab1884e19d65f5',
    #         '6463f0d98cab18e2219d65cb',
    #         '6463f0888cab1883f79d65c2',
    #         '6463edec8cab18532f9d65b3',
    #         '6463eda88cab18ea149d659a',
    #         '6463eccd8cab18273b9d6589',
    #         '6463eaf88cab18a75b9d6578',
    #     ]
    #     random_node_id = random.choice(node_ids)
    #     print("Random node id:", random_node_id)
    #     query_params = {'nodeid': random_node_id}
    #     self.client.get("/fetch-node", headers=headers, cookies=cookies, params=query_params)
    #
    # # http://localhost:3006/fetch-nodes
    # @task
    # def test_nodes(self):
    #     headers = {'Content-Type': 'application/json'}
    #     cookies = {'jwt': token}
    #     self.client.get("/fetch-nodes", headers=headers, cookies=cookies)

    # http://localhost:3008
    # jwt   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNzk2N2ZjNWQzZGVlNGY0ZDZlYjgzMSIsImlhdCI6MTY4NDM1MTQ5NywiZXhwIjoxNjg0NjEwNjk3fQ.JLcMHTBcNSPzs43PquRfZgbQYbfvQzfdOIUziWIXEqU
    @task
    def test_layers(self):
        headers = {'Content-Type': 'application/json'}
        token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNzk2N2ZjNWQzZGVlNGY0ZDZlYjgzMSIsImlhdCI6MTY4NDM1MTQ5NywiZXhwIjoxNjg0NjEwNjk3fQ.JLcMHTBcNSPzs43PquRfZgbQYbfvQzfdOIUziWIXEqU'
        cookies = {'jwt': token}
        self.client.get("/fetch-layers", headers=headers, cookies=cookies)
    #
    # # 3002
    # @task
    # def test_signup(self):
    #     headers = {'Content-Type': 'application/json'}
    #     r_user = generate_credentials()
    #     body = {'username': r_user[0], 'email': r_user[1], 'password': r_user[2]}
    #     self.client.post("/signup", json=body, headers=headers)
    #
    # # # 3002
    # @task
    # def test_login(self):
    #     headers = {'Content-Type': 'application/json'}
    #     users = [
    #         {
    #            'email': 'User_1@gmail.com',
    #             'password': 'RandomPas314'
    #         },
    #         {
    #             'email': 'User_2@gmail.com',
    #             'password': 'RandomPas232'
    #         },
    #         {
    #             'email': 'User_3@gmail.com',
    #             'password': 'RandomPas12d12'
    #         },
    #     ]
    #
    #     r_user_exists = random.choice(users)
    #     print("Random user:",r_user_exists)
    #     body = {'email': r_user_exists['email'], 'password': r_user_exists['password']}
    #     self.client.post("/login", json=body, headers=headers)
