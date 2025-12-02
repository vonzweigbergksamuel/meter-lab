export function generatePayload(meter_id: number) {
	const mockData = {
		meter_id: meter_id,
		value: generateValue(),
		unit: "W",
	};

	return mockData;
}

function generateValue() {
  return Math.floor(Math.random() * 100)
}