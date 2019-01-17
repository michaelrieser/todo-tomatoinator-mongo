class PomreportWeekListCtrl {
    constructor(PomTracker, $filter) {
        'ngInject';

        this._PomTracker = PomTracker;
        this._$filter = $filter;
        
        this.calcAndSetStats();

        this.completionMinsPieChartLabels = ['Completed Minutes', 'Missed Minutes'];
        this.completionMinsPieChartData   = [this.completedActiveMinutes, this.missedMinutes];
        this.completionMinsPieChartColors = ['#87cefa', '#cd5c5c'];

        this.pomtrackerTaskTimeMap        = this._PomTracker.getPomtrackerTaskTimeMap(this.pomtrackers);       
        this.taskBreakdownPieChartLabels  = Object.keys(this.pomtrackerTaskTimeMap);
        this.taskBreakdownPieChartData    = Object.values(this.pomtrackerTaskTimeMap);        
        this.taskBreakdownPieChartColors  = this.getStratifiedTaskColorMap();

        // **NOTE: for custom label, SEE: https://www.chartjs.org/docs/latest/configuration/tooltip.html#label-color-callback   
        this.taskBreakdownPieChartOptions = {
            tooltips: {
                // NOTE: editing 'standard' tooltip resulted in text/data getting cut off
                // callbacks: {
                //     label: function(tooltipItem, data) {
                //         console.log('tooltipItem: ', tooltipItem);
                //         console.log('data: ', data);
                //         let datasetIndex = tooltipItem.index;
                //         let tgtData = data.datasets[datasetIndex];                        
                //         let label = data.labels[datasetIndex];    

                //         return `${label} - ${tgtData}`;                    
                //     }
                // }

                // HTML External Custom Tooltip => https://www.chartjs.org/docs/latest/configuration/tooltip.html#external-custom-tooltips
                // Disable on-canvas tooltip
                enabled: false,
                
                custom: function(tooltipModel) {                 

                    // Tooltip Element
                    let tooltipEl = document.getElementById('chartjs-tooltip');

                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';                                                
                        tooltipEl.innerHTML = '<table></table>';
                        document.body.appendChild(tooltipEl);
                    }

                    // Hide if no tooltip
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = 0;
                        return;
                    }

                    // Set caret position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }               
                                  
                    /* TODO: fix caret - NOTE: none of the following worked: */
                    // tooltipEl.classList.add(tooltipModel.yAlign);   
                    // tooltipEl.classList.add('above');                                        
                    // console.log('tooltipEl.classList: ', tooltipEl.classList);                         
                    // tooltipEl.caretSize = 5;
                    // tooltipEl.caretX = 20;
                    // tooltipEl.caretY = 20;
                    // TODO - TRY editing tooltipModel (SEE => https://www.chartjs.org/docs/latest/configuration/tooltip.html#tooltip-model)
                    /* /TODO           */

                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }

                    // NOTE: borrowed from minutes-to-days-hours-minutes filter (unable to leverage due to scoping issues)
                    function minutesToDaysHoursMinutes(input, includedTimeHorizons) {                                                   
                        let inclDays = includedTimeHorizons.includes('d');
                        let inclHours = includedTimeHorizons.includes('h');
                        let inclMinutes = includedTimeHorizons.includes('m'); 
                        let returnStr = '';
                        
                        // set minutes to seconds
                        let seconds = input * 60;

                        // calc (and subtract) whole days
                        let days = Math.floor(seconds / 86400);
                        seconds -= days * 86400;

                        // calc (and subtract) whole hours
                        let hours = Math.floor(seconds / 3600);
                        seconds -= hours * 3600;

                        // calc (and subtract) whole minutes
                        let minutes = Math.floor(seconds / 60);

                        if (inclDays) returnStr += `${days}d`;
                        if (inclHours) returnStr += ` ${hours}h`;
                        if (inclMinutes) returnStr += ` ${minutes}m`;

                        return returnStr;
                    }

                    // Set Text
                    if (tooltipModel.body) {                                                 

                        var titleLines = tooltipModel.title || [];
                        var bodyLines = tooltipModel.body.map(getBody);

                        var innerHtml = '<thead>';

                        titleLines.forEach(function(title) {
                            innerHtml += '<tr><th>' + title + '</th></tr>';
                        });
                        innerHtml += '</thead><tbody>';

                        bodyLines.forEach( (body, i) => {
                            var taskLabel = body[0].split(': ')[0];
                            var minutesSpent = body[0].split(': ')[1];
                            var formattedTimeSpent = minutesToDaysHoursMinutes(minutesSpent, 'dmh');
                            var displayText = `${taskLabel}: ${formattedTimeSpent}`;

                            var colors = tooltipModel.labelColors[i];
                            var style = 'background:' + colors.backgroundColor;
                            style += '; border-color:' + colors.borderColor;
                            style += '; border-width: 2px';
                            var span = '<span style="' + style + '"></span>';
                            innerHtml += '<tr><td>' + span + displayText + '</td></tr>';
                        });
                        innerHtml += '</tbody>';

                        var tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml;
                    }

                    // `this` will be the overall tooltip
                    let position = this._chart.canvas.getBoundingClientRect();

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = 1;
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.backgroundColor = '#000';
                    tooltipEl.style.borderRadius = '5px';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                    // tooltipEl.style.fontSize = '1.5em'; // works
                    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                    tooltipEl.style.color = '#FFF';                                        
                    // tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                    tooltipEl.style.padding = '5px 5px';
                    tooltipEl.style.pointerEvents = 'none';                 

                    // NOTE: above may be set like so.. EXAMPLE: https://jsfiddle.net/patrickactivatr/ytLtmLgs/
                    //   tooltipEl.css({
                    //     fontStyle: tooltip._fontStyle,
                    //     padding: tooltip.yPadding + 'px ' + tooltip.xPadding + 'px',
                    // });   
                }
            }
        }
    }

    getStratifiedTaskColorMap() {
        return this.taskBreakdownPieChartLabels.map( (title) => {
            return this._PomTracker.taskGraphColorMap[title];
        })
    }

    calcAndSetStats() {        
        this.completedPoms          = this._PomTracker.calcCompletedPoms(this.pomtrackers);
        this.attemptedPoms          = this._PomTracker.calcAttemptedPoms(this.pomtrackers);
        this.rawPomCompletionPct    = this._PomTracker.calcRawPomCompletionPct(this.completedPoms, this.attemptedPoms);
        this.timesPaused            = this._PomTracker.calcTimesPaused(this.pomtrackers);
        this.completedActiveMinutes = this._PomTracker.calcCompletedActiveMinutes(this.pomtrackers);
        this.potentialActiveMinutes = this._PomTracker.calcPotentialActiveMinutes(this.attemptedPoms);
        this.missedMinutes          = this.potentialActiveMinutes - this.completedActiveMinutes;
    }

    noPomCompletionData() {
        return this.potentialActiveMinutes === 0;
    }

}

let PomreportWeekList =  {
    bindings: {
        pomtrackers: '=',
        date: '='
    },
    controller: PomreportWeekListCtrl,
    templateUrl: 'components/pomreport-helpers/pomreport-week-list.html'
};

export default PomreportWeekList;
