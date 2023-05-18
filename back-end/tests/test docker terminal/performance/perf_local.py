import psutil
import time
import matplotlib.pyplot as plt

if __name__ == '__main__':
    process_stats = {'time': [], 'ram': [], 'cpu': []}
    duration = 60  # Durata în secunde pentru a colecta statisticile
    interval = 1  # Intervalul de timp între măsurători în secunde
    start_time = time.time()
    current_tick = 0

    process_pid = 33299  # PID-ul procesului Express.js

    while time.time() - start_time < duration:
        current_tick += 1
        current_time = time.strftime('%H:%M:%S', time.localtime())

        # Colectează statistici pentru procesul specific
        process = psutil.Process(process_pid)
        process_info = process.as_dict()

        # Time
        process_stats['time'].append(current_time)

        # RAM
        ram_usage = psutil.virtual_memory().used / (1024 * 1024)  # RAM utilizat în MB
        process_stats['ram'].append(ram_usage)

        # CPU
        cpu_percent = process.cpu_percent(interval=0.1)
        process_stats['cpu'].append(cpu_percent)

        print("process_stats:", process_stats)
        time.sleep(interval)

    print(process_stats)

    # Plot RAM
    plt.figure(figsize=(12, 6))
    plt.plot(process_stats['time'], process_stats['ram'], label='RAM')
    plt.xlabel('Timp')
    plt.ylabel('Valoare')
    plt.title('Statistici pentru procesul Express.js - RAM')
    plt.xticks(rotation=45)
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.show()

    # Plot CPU
    plt.figure(figsize=(12, 6))
    plt.plot(process_stats['time'], process_stats['cpu'], label='CPU')
    plt.xlabel('Timp')
    plt.ylabel('Valoare')
    plt.title('Statistici pentru procesul Express.js - CPU')
    plt.xticks(rotation=45)
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.show()
