import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-create-chart',
  standalone: true,
  imports: [],
  templateUrl: './create-chart.component.html',
  styleUrl: './create-chart.component.css'
})

export class CreateChartComponent implements OnChanges {
  @Input() chartData: any;   // دیتا از بیرون میاد
  barChart: Chart | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chartData'] && this.chartData) {
      this.renderChart(this.chartData);
    }
  }

  private renderChart(data: any) {
    if (this.barChart) {
      this.barChart.destroy();
    }

    const values = [
      data.abandoned_calls,
      data.unanswered_calls,
      data.answered_calls,
      data.total_calls,
      
    ];
    const maxValue = Math.max(...values);

    // هوشمند yAxisMax و stepSize
    const padding = Math.ceil(maxValue * 0.1);
    let yAxisMax = maxValue + padding;
    const magnitude = Math.pow(10, Math.floor(Math.log10(yAxisMax)));
    yAxisMax = Math.ceil(yAxisMax / magnitude) * magnitude;
    const stepSize = Math.ceil(yAxisMax / 5 / magnitude) * magnitude || 1;

    this.barChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['ترک صف', 'پاسخ نداده', 'پاسخ داده شده', 'کل تماس‌ها'],
        datasets: [
          {
            label: `صف : ${data.queue_name}`,
            data: values,
            backgroundColor: ['#f87171', '#fbbf24', '#34d399', '#60a5fa'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              generateLabels: (chart) => {
                return chart.data.datasets.map((dataset, i) => ({
                  text: dataset.label || '',
                  fillStyle: 'transparent',
                  strokeStyle: 'transparent',
                  lineWidth: 0,
                  hidden: false,
                  datasetIndex: i,
                }));
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: yAxisMax,
            ticks: {
              stepSize: stepSize,
            },
          },
        },
      },
    });
  }
}
