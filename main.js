class Node {
constructor(value, priority) {
	this.value = value;
	this.priority = priority;
	this.next = null;
}
}

class PriorityQueueLazy {
constructor() {
	this.head = null;
}

insert(value, priority) {
	const newNode = new Node(value, priority);
	if (!this.head) {
		this.head = newNode;
	} else {
		let current = this.head;
		while (current.next) {
			current = current.next;
		}
		current.next = newNode;
	}
}

extractMax() {
	if (!this.head) {
		throw new Error("Queue is empty");
	}

	let maxNode = this.head;
	let maxPrev = null;
	let prev = null;
	let current = this.head;

	while (current) {
		if (current.priority > maxNode.priority) {
			maxNode = current;
			maxPrev = prev;
		}
		prev = current;
		current = current.next;
	}

	// Удаляем maxNode из списка
	if (maxPrev) {
		maxPrev.next = maxNode.next;
	} else {
		this.head = maxNode.next;
	}

	return maxNode.value;
}
}

// Benchmarking
function benchmarkPriorityQueue(queueClass, size) {
	const queue = new queueClass();
	const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

	const startInsert = performance.now();
	for (let i = 0; i < size; i++) {
		queue.insert(`value${i}`, randomInt(1, 1000));
	}
	const endInsert = performance.now();

	const startExtract = performance.now();
	for (let i = 0; i < size; i++) {
		queue.extractMax();
	}
	const endExtract = performance.now();

	const insertTime = endInsert - startInsert;
	const extractTime = endExtract - startExtract;

	// Отладочные сообщения для проверки значений времени
	console.log(`Size: ${size}, Insert Time: ${insertTime}ms, ExtractMax Time: ${extractTime}ms`);

	return {
		insertTime: insertTime,
		extractTime: extractTime
	};
}


// График
function plotBenchmarkResults(results) {
const ctx = document.getElementById("benchmarkChart").getContext("2d");
new Chart(ctx, {
		type: "line", 
		data: {
			labels: results.sizes.map(size => `n=${size}`),
			datasets: [
				{
					label: "Insert Time (ms)",
					data: results.insertTimes,
					backgroundColor: "rgba(75, 192, 192, 0.6)",
					borderColor: "rgba(75, 192, 192, 1)",
					borderWidth: 1,
					fill: false, 
					tension: 0.1 
				},
				{
					label: "ExtractMax Time (ms)",
					data: results.extractTimes,
					backgroundColor: "rgba(153, 102, 255, 0.6)",
					borderColor: "rgba(153, 102, 255, 1)",
					borderWidth: 1,
					fill: false,
					tension: 0.1
				}
			]
		},
		options: {
			responsive: true,
			scales: {
				y: {
					type: 'logarithmic',
					beginAtZero: true,
					title: {
						display: true,
						text: "Time (ms)"
					}
				},
				x: {
					title: {
						display: true,
						text: "Number of Elements"
					}
				}
			},
			plugins: {
				legend: {
					display: true,
					position: "top"
				}
			}
		}
});
}


const sizes = [100, 2000, 10000];
const results = {
	sizes: [],
	insertTimes: [],
	extractTimes: []
};

sizes.forEach(size => {
	const { insertTime, extractTime } = benchmarkPriorityQueue(PriorityQueueLazy, size);
	results.sizes.push(size);
	results.insertTimes.push(insertTime);
	results.extractTimes.push(extractTime);
});

plotBenchmarkResults(results);

// --------------------------------------------------------------------



class Heap {
	constructor() {
		this.heap = [];
	}

	insert(value, priority) {
		const node = { value, priority };
		this.heap.push(node);
		this.heapifyUp();
	}

	heapifyUp() {
		let index = this.heap.length - 1;
		while (index > 0) {
			const parentIndex = Math.floor((index - 1) / 2);
			if (this.heap[parentIndex].priority >= this.heap[index].priority) break;
			[this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
			index = parentIndex;
		}
	}

	extractMax() {
		if (this.heap.length === 0) throw new Error("Heap is empty");
		if (this.heap.length === 1) return this.heap.pop().value;

		const maxValue = this.heap[0].value;
		this.heap[0] = this.heap.pop();
		this.heapifyDown();
		return maxValue;
	}

	heapifyDown() {
		let index = 0;
		const length = this.heap.length;
		while (index < length) {
			const leftChildIndex = 2 * index + 1;
			const rightChildIndex = 2 * index + 2;
			let largest = index;

			if (leftChildIndex < length && this.heap[leftChildIndex].priority > this.heap[largest].priority) {
				largest = leftChildIndex;
			}

			if (rightChildIndex < length && this.heap[rightChildIndex].priority > this.heap[largest].priority) {
				largest = rightChildIndex;
			}

			if (largest === index) break;

			[this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
			index = largest;
		}
	}
}

function benchmarkHeap(size) {
	const heap = new Heap();
	const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

	const startInsert = performance.now();
	for (let i = 0; i < size; i++) {
		heap.insert(`task${i}`, randomInt(1, 1000));
	}
	const endInsert = performance.now();

	const startExtract = performance.now();
	for (let i = 0; i < size; i++) {
		heap.extractMax();
	}
	const endExtract = performance.now();

	
	const insertTime = endInsert - startInsert;
	const extractTime = endExtract - startExtract;

	console.log(`Size: ${size}, Insert Time: ${insertTime}ms, ExtractMax Time: ${extractTime}ms`);

	return { insertTime, extractTime };
}

function plotHeapBenchmark() {
	const sizes = [1, 1000, 100000];
	const insertTimes = [];
	const extractTimes = [];

	sizes.forEach(size => {
		const { insertTime, extractTime } = benchmarkHeap(size);
		insertTimes.push(insertTime);
		extractTimes.push(extractTime);
	});

	const ctx = document.getElementById("heapBenchmarkChart").getContext("2d");
	new Chart(ctx, {
		type: "line",
		data: {
			labels: sizes,
			datasets: [
				{
					label: "Insert Time (ms)",
					data: insertTimes,
					borderColor: "rgba(75, 192, 192, 1)",
					fill: false,
					borderWidth: 1,
					tension: 0.1
				},
				{
					label: "ExtractMax Time (ms)",
					data: extractTimes,
					borderColor: "rgba(153, 102, 255, 1)",
					fill: false,
					borderWidth: 1,
					tension: 0.1
				}
			]
		},
		options: {
			responsive: true,
			scales: {
				y: {
					title: {
						display: true,
						text: "Time (ms)"
					}
				},
				x: {
					title: {
						display: true,
						text: "Number of Elements"
					},
					type: 'logarithmic',
					ticks: {
						autoSkip: true,
						maxTicksLimit: 6
					}
				}
			},
			plugins: {
				legend: {
					position: "top"
				}
			}
		}
	});
}

plotHeapBenchmark();
