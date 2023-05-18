import docker
import time
import matplotlib.pyplot as plt

if __name__ == '__main__':
    container_ids = [
        # 'dca76a37618d', #users
        # '1850d589cf2d', #layers
        'd92090394361', #api-gateway

    ]  # Lista de ID-uri ale containerelor

    container_stats = {
        container_id: {'time': [], 'ram': [], 'cpu': [], 'disk': []}
        for container_id in container_ids
    }

    duration = 60  # Durata în secunde pentru a colecta statisticile

    start_time = time.time()
    client = docker.from_env()
    current_tick = 0

    while time.time() - start_time < duration:
        current_tick += 1
        current_time = time.strftime('%H:%M:%S', time.localtime())

        for container_id in container_ids:
            container = client.containers.get(container_id)
            stats = container.stats(stream=False)

            # time
            container_stats[container_id]['time'].append(current_time)

            # ram
            ram_usage = stats['memory_stats']['usage']
            container_stats[container_id]['ram'].append(ram_usage)

            # cpu
            cpu_usage = stats['cpu_stats']['cpu_usage']['total_usage']
            container_stats[container_id]['cpu'].append(cpu_usage)

            # disk
            memory_usage = stats['blkio_stats']['io_service_bytes_recursive'][0]['value'] + stats['blkio_stats']['io_service_bytes_recursive'][1]['value']
            container_stats[container_id]['disk'].append(memory_usage)

            print("container_stats:",container_stats)
        time.sleep(1)
    print(container_stats)

    for container_id in container_ids:
        # Plot RAM
        plt.figure(figsize=(12, 6))
        plt.plot(container_stats[container_id]['time'], container_stats[container_id]['ram'], label='RAM')
        plt.xlabel('Timp')
        plt.ylabel('Valoare')
        plt.title(f'Statistici pentru containerul {container_id} - RAM')
        plt.xticks(rotation=45)
        plt.legend()
        plt.grid(True)
        plt.tight_layout()
        plt.show()

        # Plot CPU
        plt.figure(figsize=(12, 6))
        plt.plot(container_stats[container_id]['time'], container_stats[container_id]['cpu'], label='CPU')
        plt.xlabel('Timp')
        plt.ylabel('Valoare')
        plt.title(f'Statistici pentru containerul {container_id} - CPU')
        plt.xticks(rotation=45)
        plt.legend()
        plt.grid(True)
        plt.tight_layout()
        plt.show()

        # Plot Disk
        plt.figure(figsize=(12, 6))
        plt.plot(container_stats[container_id]['time'], container_stats[container_id]['disk'], label='Disk')
        plt.xlabel('Timp')
        plt.ylabel('Valoare')
        plt.title(f'Statistici pentru containerul {container_id} - Disk')
        plt.xticks(rotation=45)
        plt.legend()
        plt.grid(True)
        plt.tight_layout()
        plt.show()
