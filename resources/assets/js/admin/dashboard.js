var chartist = require('chartist');

Vue.component('dashboard', {
    ready() {
        this.pageViewChart();
    },

    data() {
        return {
            pages: []
        }
    },

    methods: {
        pageViewChart() {
            this.$http.get('/pages/top')
                .then(function(response) {
                    this.pages = response.data.pages;

                    var labels = [];
                    var series = [];

                    for (var i = 0; i < this.pages.length; i++) {
                        if (i == 5) {
                            break;
                        }

                        labels.push(this.pages[i].name);
                        series.push(this.pages[i].views);
                    }

                    new chartist.Bar('#pageViewChart', {
                        labels: labels,
                        series: series
                    }, {
                        distributeSeries: true
                    });
                });
        }
    }
});