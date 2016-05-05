"use strict";
import d3 from 'd3';

export function ZoomableLabels() {
    let labelText = null;
    let labelPosition = null;
    let labelParent = null
    let labelClass = 'zoomable-label';
    let markerClass = 'resort-rect';

    let labelMarkerId = null;
    let previouslyVisible = {};
    let markerPreviouslyVisible = {};

    let visibilityCounter = 0;

    function intersectRect(r1, r2, padding) {
        if (arguments.length < 3)
            padding = 0;

        if (r1.width == 0 || r2.width == 0)
            return false;

        return !(r2.left > (r1.right + padding) || 
                 r2.right < (r1.left - padding) || 
                 r2.top > (r1.bottom + padding) ||
                 r2.bottom < (r1.top - padding));
    }

    function chart(selection) {
       // go through 
        let textLabels = selection.selectAll(labelClass)
        .attr('visibility', 'visible')

        let objs = []
        textLabels.each((d) => { objs.push(d) })
        objs.sort((a,b) => { return +b.area - (+a.area); })

        //objs.forEach((d) => { console.log('d.area:', d.area )});

        let markerObjs = selection.selectAll(markerClass)
        .attr('visibility', 'visible');

        textLabels.each(function(d) {
            if (d.uid in previouslyVisible)
                d.shown = true;
        });

        markerObjs.each(function(d) {
            if (d.uid in markerPreviouslyVisible)
                d.markerShown = true;
        })
        .on('mouseover', function(d) {
            console.log('uid:', d.uid);
            console.log('pv:', d.name, markerPreviouslyVisible[d.uid] - 1458700000000, d.cumarea);
        });;


        let textRects = {};
        let rectRects = {};

        textLabels.each(function(d) {
            textRects[d.uid] = this.getBoundingClientRect();
            rectRects[d.uid] = labelParent.select('#' + labelMarkerId(d)).node().getBoundingClientRect();
        });

        //console.log('-------------------');
        objs.forEach(function(d,i) {
            //console.log('d:', d.area);
            let bb1 = textRects[d.uid];
            let rb1 = rectRects[d.uid];

            let rectIntersect = false;
            let labelIntersect = false;

            objs.forEach(function(e,i) {
                if (d == e)
                    return;

                let bb2 = textRects[e.uid]; 
                let rb2 = rectRects[e.uid]; 

                if (e.shown && intersectRect(bb1, bb2, 2)) {
                    labelIntersect = true;

                    if (d.shown) {
                        if (previouslyVisible[d.uid] <= previouslyVisible[e.uid])
                            e.shown = false;

                    }
                }

                if (e.markerShown && intersectRect(rb1, rb2, 1)) {
                    let contact = false;
                    let uid1 = '8e8aa';
                    let uid2 = '1ef59';

                    if (d.uid.search(uid1) >= 0 && e.uid.search(uid2) >= 0) {
                        contact = true;
                        //console.log('contact');
                    }

                    if (e.uid.search(uid1) >= 0 && d.uid.search(uid2) >= 0) {
                        contact = true;
                        //console.log('contact');
                    }

                    if (d.shown) {
                        if (previouslyVisible[d.uid] <= previouslyVisible[e.uid])
                            e.shown = false;
                    }

                    if (d.markerShown) {
                        /*
                        if (contact)
                            console.log('markerPreviouslyVisible', markerPreviouslyVisible[d.uid],
                                        markerPreviouslyVisible[e.uid]);
                                        */
                        if (markerPreviouslyVisible[d.uid] <= markerPreviouslyVisible[e.uid])
                            e.markerShown = false;
                    }

                    rectIntersect = true;
                }

            });

            let date = new Date();
            if (!labelIntersect && !rectIntersect) {
                d.shown = true;
                d.markerShown = true;

                if (!(d.uid in previouslyVisible)) {
                    previouslyVisible[d.uid] = visibilityCounter;
                    markerPreviouslyVisible[d.uid] = visibilityCounter;
                    visibilityCounter += 1;
                }
            } else if (!rectIntersect) {
                d.markerShown = true;

                if (!(d.uid in markerPreviouslyVisible)) {
                    markerPreviouslyVisible[d.uid] = date.getTime();
                }
            }
        });

        textLabels.filter((d) => { return !d.shown; })
        .attr('visibility', 'hidden');

        markerObjs.filter((d) => { return !d.markerShown; })
        .attr('visibility', 'hidden');


    }

    chart.labelPosition = function(_) {
        if (!arguments.length) return labelPosition;
        labelPosition = _;
        return chart;
    }

    chart.labelParent = function(_) {
        if (!arguments.length) return labelParent;
        labelParent = _;
        return chart;
    }

    chart.labelMarkerId = function(_) {
        if (!arguments.length) return labelMarkerId;
        labelMarkerId = _;
        return chart;
    }

    chart.labelClass = function(_) {
        if (!arguments.length) return labelClass;
        labelClass = _;
        return chart;
    }

    chart.markerClass = function(_) {
        if (!arguments.length) return markerClass;
        markerClass = _;
        return chart;
    }

    return chart;
}

