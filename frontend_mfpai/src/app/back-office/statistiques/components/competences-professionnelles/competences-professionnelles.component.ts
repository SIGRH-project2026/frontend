import { AfterViewInit, Component, OnInit } from "@angular/core";
import { CanvasJS } from "@canvasjs/angular-charts";
import { NgxSpinnerService } from "ngx-spinner";

declare var $: any;

@Component({
  selector: 'app-competences-professionnelles',
  templateUrl: './competences-professionnelles.component.html',
  styleUrls: ['./competences-professionnelles.component.css']
})
export class CompetencesProfessionnellesComponent implements OnInit, AfterViewInit {

  searchResult: boolean = false;
  headers: string[] = ['IA', 'IEF', 'Établissement', '%'];

  colors1 = CanvasJS.addColorSet("paletteColor",
    [
      "#1D4A7B", // color par default
      "#E8EDF2", // color par secondaire
    ]);

  translateTextFrench = CanvasJS.addCultureInfo("fr", {
    savePNGText: "Format PNG",
    saveJPGText: "Format JPEG",
    printText: "Imprimer"
  });

  graphe = [
    { id: 1, label: "Circulaire" },
    { id: 2, label: "Batônnet" }
  ];

  etablissements = [
    { id: 1, label: "Établissement 1" },
    { id: 2, label: "Établissement 2" }
  ];

  dataResults: any[] = [
    {
      id: 1,
      region: 'Dakar',
      ia: 'IA Dakar',
      ief: 'Lorem ipsum',
      etablissement: "Établissement 1",
      percent: 20
    },
    {
      id: 2,
      region: 'Dakar',
      ia: 'IA Dakar',
      ief: 'Lorem ipsum',
      etablissement: "Établissement 2",
      percent: 80
    },
  ]

  constructor(
    private spinner: NgxSpinnerService
  ) { }

  ngAfterViewInit(): void {
    this.initializeSelectpicker();
  }

  ngOnInit(): void {
  }

  private initializeSelectpicker(): void {
    // Initialiser Bootstrap-select ici
    $('#selectGraphe').selectpicker();
    $('#selectEtablissement').selectpicker();
    this.updateSelectTextButton();
  }

  onSearch() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 1 seconds */
      this.spinner.hide();
      this.searchResult = !this.searchResult;
    }, 1000);

  }

  onResetSearch() {
    this.searchResult = false
  }

  exportToPdf() { }

  exportToExcel() { }

  generateChartOptions(titleText: string, yAxisTitle: string, dataSeries: any) {
    return {
      exportEnabled: true,
      culture: "fr",
      animationEnabled: true,
      creditText: "",
      creditHref: "",
      colorSet: "paletteColor",
      title: {
        horizontalAlign: "left",
        text: titleText,
        fontSize: 16,
        fontColor: "#1F2328",
        fontWeight: "500",
        fontFamily: "Roboto, sans-serif",
        padding: {
          bottom: 20,
        },
      },
      axisY: {
        title: yAxisTitle,
        titleFontSize: 13,
        gridColor: "#E1E7EC",
        includeZero: true,
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        itemclick: function (e: any) {
          if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
          } else {
            e.dataSeries.visible = true;
          }
          e.chart.render();
        },
      },
      data: dataSeries.map((series: any) => ({
        type: series.type,
        name: `% ${series.name}`,
        indexLabel: "{y} %",
        legendText: series.legendText,
        showInLegend: series.showInLegend,
        dataPoints: series.dataPoints,
      })),
    };
  }

  // Example of how to use the function to generate chart options
  chartOptionsBatonnet = this.generateChartOptions(
    "Histogramme : Pourcentage de formateurs de la région de Dakar.",
    "Pourcentage de formateurs",
    [
      {
        type: "column",
        name: "Pourcentage de formateurs",
        dataPoints: [
          { label: "Etablissement 1", y: 20 },
          { label: "Etablissement 2", y: 80 }
        ]
      }
    ]
  );


  // Function to generate chart options for a doughnut chart
  generateDoughnutChartOptions(title: string, dataPoints: any, tooltipLabel: string) {
    return {
      exportEnabled: true,
      creditText: "",
      creditHref: "",
      culture: "fr",
      animationEnabled: true,
      colorSet: "paletteColor",
      title: {
        horizontalAlign: "left",
        text: title,
        fontSize: 16,
        fontColor: "#1F2328",
        fontWeight: "500",
        fontFamily: "Roboto, sans-serif",
      },
      data: [
        {
          type: "doughnut",
          showInLegend: true,
          toolTipContent: `{name} - ${tooltipLabel} : <strong>{y}</strong> %`,
          indexLabel: "{name}: {y}",
          dataPoints: this.aggregateData(dataPoints),
        },
      ],
    };
  }

  aggregateData(dataPoints: any) {
    const aggregatedData: any = {};

    dataPoints.forEach((point: any) => {
      const name = point.name;

      if (!aggregatedData[name]) {
        aggregatedData[name] = 0;
      }

      aggregatedData[name] += point.y;
    });

    return Object.keys(aggregatedData).map((name) => ({
      y: aggregatedData[name],
      name: name,
    }));
  }

  chartOptionsCirculaire = this.generateDoughnutChartOptions(
    "Diagramme circulaire : Pourcentage de formateurs de la région de Dakar.",
    [
      { y: 20, name: "Etablissement 1" },
      { y: 80, name: "Etablissement 2" },
    ],
    "Pourcentage de formateurs"
  );

  updateSelectTextButton(): void {
    const selectAll = document.querySelectorAll('.bs-select-all');
    selectAll.forEach(e => e.textContent! = "Tout")

    const deselectAll = document.querySelectorAll('.bs-deselect-all');
    deselectAll.forEach(e => e.textContent! = "Aucun")
  }

}
