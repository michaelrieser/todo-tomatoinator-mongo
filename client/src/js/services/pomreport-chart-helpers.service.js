export default class PomreportChartHelpers {
    constructor() {
        'ngInject';

        this.taskChartColors = ['#a6cee3', '#6a3d9a', '#b2df8a', '#b15928', '#fb9a99', '#ff7f00', '#b44d1d', '#ffff99', '#e31a1c', '#fdbf6f',
            '#1f78b4', '#33a02c', '#00fff7', '#a000a3', '#887aff', '#a31e00', '#fad900', '#fa0057', '#a69c96', '#4aa9f2'];

        this.completionMinsPieChartLabels  = ['Completed Minutes', 'Missed Minutes'];
        this.completionMinsPieChartColors  = ['#87cefa', '#cd5c5c'];
        this.completionMinsPieChartOptions = {
            elements: {
                arc: { borderWidth: 1 }
            }
        }

        this.taskBreakdownPieChartOptions = {
            elements: { arc: { borderWidth: 1 } },
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

                custom: function (tooltipModel) {

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

                        titleLines.forEach(function (title) {
                            innerHtml += '<tr><th>' + title + '</th></tr>';
                        });
                        innerHtml += '</thead><tbody>';

                        bodyLines.forEach((body, i) => {
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

    // setBaseTaskChartColorMap(pomtrackers) { // *NOTE: deprecated method using pomtracker objects, now using task titles
    //     // TODO: account for case when there are more than 20 tasks
    //     this.baseTaskChartColorMap = pomtrackers.reduce((taskColorMap, p) => {
    //         if (!p.task || !p.task.title) { return taskColorMap; }
    //         let taskTitle = p.task.title;
    //         if (!(taskTitle in taskColorMap)) {
    //             let tgtColorIdx = Object.keys(taskColorMap).length; // length => current index + 1
    //             taskColorMap[taskTitle] = this.taskChartColors[tgtColorIdx];
    //         }
    //         return taskColorMap;
    //     }, new Map())        
    // }

    setBaseTaskChartColorMap(taskTitles) {
        // TODO: account for case when there are more than 20 tasks
        this.baseTaskChartColorMap = taskTitles.reduce((taskColorMap, taskTitle) => {
            if (!taskTitle) { return taskColorMap; } // title is undefined (shouldn't happen - only in pomtrackers created before initialTaskTitle was set && task deleted)
            if (!(taskTitle in taskColorMap)) {
                let tgtColorIdx = Object.keys(taskColorMap).length; // length => current index + 1
                taskColorMap[taskTitle] = this.taskChartColors[tgtColorIdx];
            }
            return taskColorMap;
        }, new Map())        
    }

    getStratifiedTaskChartColors(targetTaskLabels) {
        return targetTaskLabels.map((title) => {
            return this.baseTaskChartColorMap[title];
        })
    }

}
