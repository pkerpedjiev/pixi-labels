import d3 from 'd3';
import PIXI from 'pixi.js';
import boxIntersect from 'box-intersect';

export function pixiIntersect(divName) {

let width = 400, height = 400;

let canvas = d3.select(divName).append('canvas')
.attr('width', width)
.attr('height', height)
.style('position', 'absolute')
.style('top', "0px")
.style('left', "0px")


let svg = d3.select('#circle').append('svg')
.attr('width', width)
.attr('height', height)
.style('position', 'absolute')
.style('top', "0px")
.style('left', "0px")


let renderer = PIXI.autoDetectRenderer(width, height,
        {
            //backgroundColor: 0xdddddd,
            backgroundColor: 0xdddddd,
         antialias: true,
         view: canvas.node()
        });



// create the root of the scene graph
var stage = new PIXI.Container();
var pMain = new PIXI.Graphics();
stage.addChild(pMain);

function animate() {
    requestAnimationFrame(animate);

    // render the container
    renderer.render(stage);
}
animate();

var text = new PIXI.Text("Pixi.js has text!", {font:"15px Arial", fill:"red"});
pMain.addChild(text);

let gMain = svg.append('g')
let texts = []

let paneRect = gMain.append('rect')
.attr('fill', 'transparent')
.attr('width', width)
.attr('height', height)

let minX = 0, minY = 0;
let maxX = width, maxY = height;
//let maxX =10, maxY = 60;
let format = d3.format(".2n")

let points = d3.range(0,500).map((d) => { 
    let dotSize = 10 * Math.random();

    return {'x': minX + (maxX - minX) * Math.random(),
            'y': minY + (maxY - minY) * Math.random(),
            'r': dotSize,
            'label': format(dotSize),
            'name': d.toString()}});

points.forEach(function(d) {
    var text = new PIXI.Text(d.label, {font:"15px Arial", fill:"red"});
    text.position.x = d.x;
    text.position.y = d.y;
    //text.anchor.x = d.x;
    //text.anchor.y = d.y;

    texts.push(text);

    pMain.addChild(text);
});

let xScale = d3.scale.linear().domain([minX, maxX]).range([ 0, width ])
let yScale = d3.scale.linear().domain([minY, maxY]).range([ 0, height ])

let zoom = d3.behavior.zoom()
    .x(xScale)
    .y(yScale)
    .on('zoom', draw)

gMain.call(zoom);

function draw() {
    pMain.position.x = zoom.translate()[0];
    pMain.position.y = zoom.translate()[1];
    pMain.scale.x = zoom.scale();
    pMain.scale.y = zoom.scale();

    let boxes = [];

    for (let i = 0; i < texts.length; i++) {
        texts[i].scale.x = 1 / zoom.scale();
        texts[i].scale.y = 1 / zoom.scale();

        //texts[i].visible = true;
        texts[i].alpha = 1;

        let box = texts[i].getBounds();
        boxes.push([box.x, box.y, box.x + box.width, box.y + box.height]);

    };

    //console.log('boxes[0]', boxes[0], boxes[1]);

    var result = boxIntersect(boxes, function(i,j) {
            if (points[i].r > points[j].r)
                texts[j].alpha = 0;
            else
                texts[i].alpha = 0;
    })

    //console.log('boxes:', boxes);
    //console.log('text', text.getBounds());
}

draw();


}
