//config supabase
const SUPABASE_URL = 'https://voskkwdrimdogqfxcflb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvc2trd2RyaW1kb2dxZnhjZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4OTA1OTgsImV4cCI6MjA2OTQ2NjU5OH0.K3w8xhb-IQF7BPTL0F2vwnw9BtIZJ79J8o7CLmU-s3M';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', async function() {
    //autenticación anonima
    await supabase.auth.signInAnonymously(); //await es asyn(cronic) function

    //Ejecutar todaas las funciones
    fetchtop20Paises();
    fetchtopRegiones();
    fetchcolombia_SurAmerica();

    //Grafico de barras top 20 paises
    async function fetchtop20Paises() {
        const {data, error} = await supabase
            .from('top20Paises')
            .select('*')
            .order('promedio_renovables', {ascending: false})
            .limit(20);

            if (error) throw error;
            
            createBarChart('graficoBarrasPaises', data, 'pais', 'promedio_renovables', 'porcentaje de Energía Renovable', 'rgba(55, 133, 186, 0.8)')
    }

    //Grafico de barras de regiones
    async function fetchtopRegiones(){
        const {data, error} = await supabase
            .from('topRegiones')
            .select('*')
            .order('promedio_renovables', {ascending: false})
            .limit(20);

            if (error) throw error;
            
            createBarChart('graficoBarrasRegiones', data, 'region', 'promedio_renovables', 'porcentaje de Energía Renovable', 'rgba(55, 133, 186, 0.8)')
    }
    
    //función para crear graficos
    function createBarChart(canvasId, data, labelField, dataField, label, backgroundColor){
        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart (ctx, {
            type: 'bar',
            data: {
                labels: data.map(item => item[labelField]),
                datasets: [{
                    label: label,
                    data: data.map(item => item[dataField]),
                    backgroundColor: backgroundColor,
                    borderColor: backgroundColor.replace('0.6','1'),
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
                            text: canvasId.includes('paises') ? 'paises' : 'regiones'
                        }
                    },
                }
            }

        });


    }

    //Grafico lineas comparativas
    async function fetchcolombia_SurAmerica() {
        const {data, error} = await supabase
            .from ('colombia_SurAmerica')
            .select ('*')
            .lte('anno', 2021)
            .order('anno', {ascending: true});
        if (error) throw error;

        //procesar la data
        const colombiaData = data.filter (item => item.region === 'Colombia');
        const suramericaData = data.filter (item => item.region === 'South America');
        const years = [... new Set(data.map(item => item.anno))];

        const ctx = document.getElementById('graficoLineasComparativa').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: years, 
                datasets: [
                    {
                        label: 'Colombia',
                        data: colombiaData.map(item => item.renovables),
                        borderColor: 'rgba(55, 133, 186, 1)',
                        backgroundColor: 'rgba(55, 133, 186, 0.2)',
                        fill: false,
                        borderWidth: 1,
                        tension: 0.2,
                    },
                    {
                        label: 'Suramérica',
                        data:suramericaData.map(item => item.renovables),
                        borderColor: 'rgba(50, 200, 10, 1)',
                        backgroundColor: 'rgba(50, 200, 10, 0.571)',
                        fill: false,
                        borderWidth: 1,
                        tension: 0.2,
                    }
                ]
            }
        }) 

    }

   
});
