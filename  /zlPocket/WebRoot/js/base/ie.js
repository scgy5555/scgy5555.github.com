var lastXY = {};

function DoEvent(eventObject) {
	// stop panning and zooming so we can draw
	if(eventObject.preventManipulation) eventObject.preventManipulation();

	// we are handling this event
	if(eventObject.preventDefault) eventObject.preventDefault();

	// if we have an array of changedTouches, use it, else create an array of one with our eventObject
	var touchPoints = (typeof eventObject.changedTouches != 'undefined') ? eventObject.changedTouches : [eventObject];
	for(var i = 0; i < touchPoints.length; ++i) {
		var touchPoint = touchPoints[i];
		// pick up the unique touchPoint id if we have one or use 1 as the default
		var touchPointId = (typeof touchPoint.identifier != 'undefined') ? touchPoint.identifier : (typeof touchPoint.pointerId != 'undefined') ? touchPoint.pointerId : 1;

		if(eventObject.type.match(/(down|start)$/i)) {
			// process mousedown, MSPointerDown, and touchstart
			lastXY[touchPointId] = {
				x: touchPoint.pageX,
				y: touchPoint.pageY
			};
			console.log(touchPointId+","+touchPoint.pageX+","+touchPoint.pageY);
		} else if(eventObject.type.match(/move$/i)) {
			// process mousemove, MSPointerMove, and touchmove
			if(lastXY[touchPointId] && !(lastXY[touchPointId].x == touchPoint.pageX && lastXY[touchPointId].y == touchPoint.pageY)) {
				lastXY[touchPointId] = {
					x: touchPoint.pageX,
					y: touchPoint.pageY
				};
				console.log(touchPointId+","+touchPoint.pageX+","+touchPoint.pageY);
			}
		} else if(eventObject.type.match(/(up|end)$/i)) {
			// process mouseup, MSPointerUp, and touchend
			console.log(touchPointId+","+touchPoint.pageX+","+touchPoint.pageY);
		}
	}
}