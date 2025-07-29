document.addEventListener('DOMContentLoaded', function() {
    //Grafico de barras para top 20 paises con energias limpias
    fetch('data/top20Paises.json')
        .then(Response => Response.json())
        .then(data => {
            const ctx = document.getElementById('graficoBarrasPaises').getContext('2d')
            new Chart (ctx, {
                type: 'bar',
                data: {
                    labels: data.map(item => item.pais),
                    datasets: [{
                        label: 'Porcentaje de Energía Renovable',
                        data: data.map(item => item['promedio_renovables']),
                        backgroundColor: 'rgba(22, 53, 110, 0.671)',
                        borderColor: 'rgba(52,162,235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Porcentaje (%)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Paises'
                            }
                        },
                    }
                }
            });
        });

        //Grafico de barras para regiones//
        fetch('data/topRegiones.json')
        .then(Response => Response.json())
        .then(data => {
            const ctx = document.getElementById('graficoBarrasRegiones').getContext('2d')
            new Chart (ctx, {
                type: 'bar',
                data: {
                    labels: data.map(item => item.region),
                    datasets: [{
                        label: 'Porcentaje de Energía Renovable',
                        data: data.map(item => item['promedio_renovables']),
                        backgroundColor: 'rgba(100, 10, 60, 0.571)',
                        borderColor: 'rgba(100, 10, 60, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Porcentaje (%)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Regiones'
                            }
                        },
                    }
                }
            });
        });

        //grafico de lineas cocolo vs surA
        fetch('data/colombia_SurAmerica.json')
            .then(response => response.json())
            .then(data => {
                const filteredData = data.filter(item => item.anno <=2021)
                const ctx = document.getElementById('graficoLineasComparativa').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: [...new Set(filteredData.map(item => item.anno))],
                        datasets: [
                            {
                                label: 'Colombia',
                                data: filteredData.filter(item => item.region === 'Colombia').map(item =>item.renovables),
                                borderColor: 'rgba(60, 200, 100, 1)',
                                backgroundColor: 'rgba(100, 200, 250, 0.571)',
                                fill: false,
                                borderWidth: 1,
                                tension: 0.2,
                            },
                            {
                                label: 'Suramérica',
                                data: filteredData.filter(item => item.region === 'South America').map(item =>item.renovables),
                                borderColor: 'rgba(50, 200, 10, 1)',
                                backgroundColor: 'rgba(50, 200, 10, 0.571)',
                                fill: false,
                                borderWidth: 1,
                                tension: 0.2,
                            }
                        ]
                    }
                })
            });
})