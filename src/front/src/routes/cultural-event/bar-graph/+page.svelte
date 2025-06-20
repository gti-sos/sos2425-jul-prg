<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import zingchart from 'zingchart/es6';
	import 'zingchart/es6';

	const API = import.meta.env.DEV
		? 'http://localhost:16078/api/v1/cultural-events'
		: '/api/v1/cultural-events';

	let chartData = [];
	let selectedYear = '';
	let selectedProvince = 'Todas';
	let uniqueYears = [];
	let uniqueProvinces = [];

	async function fetchData() {
		try {
			const res = await fetch(API);
			const data = await res.json();
			chartData = data;
			uniqueYears = [...new Set(data.map((d) => d.year))];
			uniqueProvinces = [...new Set(data.map((d) => d.province))];
			if (!selectedYear && uniqueYears.length > 0) selectedYear = uniqueYears[0];
			renderCharts();
		} catch (err) {
			console.error('Error fetching data', err);
		}
	}

	function renderCharts() {
		const filtered = chartData.filter(
			(d) =>
				d.year == selectedYear && (selectedProvince === 'Todas' || d.province === selectedProvince)
		);
		if (filtered.length === 0) {
			zingchart.exec('barChart1', 'destroy');
			zingchart.exec('barChart2', 'destroy');
			zingchart.exec('barChart3', 'destroy');
			return;
		}

		const provinces = [...new Set(filtered.map((d) => d.province))];

		const totalEventsByProvince = provinces.map((p) =>
			filtered.filter((d) => d.province === p).reduce((sum, d) => sum + d.total_event, 0)
		);
		const avgPriceByProvince = provinces.map((p) => {
			const values = filtered.filter((d) => d.province === p).map((d) => d.avg_ticket_price);
			return values.reduce((a, b) => a + b, 0) / values.length;
		});
		const avgAttendanceByProvince = provinces.map((p) => {
			const values = filtered.filter((d) => d.province === p).map((d) => d.total_attendance);
			return values.reduce((a, b) => a + b, 0) / values.length;
		});

		zingchart.render({
			id: 'barChart1',
			width: '100%',
			height: 300,
			data: {
				type: 'bar',
				title: { text: 'Total de eventos' },
				scaleX: { values: provinces },
				scaleY: { label: { text: 'Eventos' } },
				series: [{ values: totalEventsByProvince }]
			}
		});

		zingchart.render({
			id: 'barChart2',
			width: '100%',
			height: 300,
			data: {
				type: 'bar',
				title: { text: 'Precio medio de entradas' },
				scaleX: { values: provinces },
				scaleY: { label: { text: 'Euros' } },
				series: [{ values: avgPriceByProvince }]
			}
		});

		zingchart.render({
			id: 'barChart3',
			width: '100%',
			height: 300,
			data: {
				type: 'bar',
				title: { text: 'Asistencia media total' },
				scaleX: { values: provinces },
				scaleY: { label: { text: 'Personas' } },
				series: [{ values: avgAttendanceByProvince }]
			}
		});
	}

	onMount(() => fetchData());
</script>

<svelte:head>
	<title>Bar Graph - Eventos culturales</title>
</svelte:head>

<section class="graph-wrapper">
	<div class="header">
		<h1>📊 Gráficas de Eventos Culturales</h1>
		<p>Comparación por provincia para el año seleccionado</p>
	</div>

	<div class="controls">
		<label for="year-select">Seleccionar año:</label>
		<select id="year-select" bind:value={selectedYear} on:change={renderCharts}>
			{#each uniqueYears as year}
				<option value={year}>{year}</option>
			{/each}
		</select>
	</div>

	<div class="cards-container">
		<div class="chart-card">
			<div id="barChart1"></div>
		</div>
		<div class="chart-card">
			<div id="barChart2"></div>
		</div>
		<div class="chart-card">
			<div id="barChart3"></div>
		</div>
	</div>
</section>

<style>
	.graph-wrapper {
		padding: 2rem 1rem;
		max-width: 1200px;
		margin: auto;
	}

	.header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.header h1 {
		font-size: 2rem;
		color: #1e3a8a;
		margin: 0;
	}

	.header p {
		font-size: 1rem;
		color: #555;
	}

	.controls {
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.controls select {
		padding: 0.4rem 0.8rem;
		border-radius: 6px;
		border: 1px solid #ccc;
		margin-left: 0.5rem;
	}

	.cards-container {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	.chart-card {
		background: white;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		padding: 1rem;
	}

	@media (min-width: 768px) {
		.cards-container {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
