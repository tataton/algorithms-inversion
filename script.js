/* Counts the number of inversions in a list of numbers, using the divide-and-
conquer merge sort method. The list is input from a text (.txt) file on the
user's local machine. In order to create the array in memory, I'm using the
HTML5 FileReader API. We'll see how that goes.*/

var inversionCounter = 0;

function countInversions (inputArray) {
  // Recursive method for inversion counting.
  // If array has 0 or 1 entries, no inversions.
  if (inputArray.length <= 1) {
    return 0;
  } else {
    // Split the array. Floor deals with odd lengths.
    var slicePoint = Math.floor(inputArray.length / 2);
    var leftHalf = inputArray.slice(0, slicePoint);
    var rightHalf = inputArray.slice(slicePoint);
    // If subarrays are big enough, keep splitting.
    if (leftHalf.length > 1) {
      countInversions(leftHalf);
    }
    if (rightHalf.length > 1) {
      countInversions(rightHalf);
    }
    /* Then merge, counting inversions as we go. Method alters inputArray,
    such that array is sorted when it returns to calling code.*/
    for (var i = 0; i < inputArray.length; i++) {
      if (leftHalf.length == 0) {
        inputArray[i] = rightHalf.shift();
      } else if (rightHalf.length == 0) {
        inputArray[i] = leftHalf.shift();
      } else if (leftHalf[0] > rightHalf[0]) {
        // Inversion! Increase inversionCounter by number of digits in leftHalf.
        inversionCounter += leftHalf.length;
        inputArray[i] = rightHalf.shift();
      } else {
        /* LeftHalf digit is less than rightHalf, which is the normal order
        of things. Incorporate digit without incrementing countInversions.*/
        inputArray[i] = leftHalf.shift();
      }
    }
    return inversionCounter;
  }
}

window.onload = function() {
  var output = document.getElementById("inversionOutput");
  // Check for File API support
  if (window.File && window.FileList && window.FileReader) {
    // then browser is compatible with API. Main code follows.
      var fileInput = document.getElementById("fileInput");
      fileInput.addEventListener("change", function(event) {
        // Changing file input content triggers method.
        var file = event.target.files[0];
        // Input should only yield one filename. Screen against zero:
        if (!file) {
            inversionOutput.textContent = "Failed to load file.";
        } else if (!file.type.match("text.*")) {
        		inversionOutput.textContent = file.name + " is not a valid text file.";
        } else {
            var reader = new FileReader();
            reader.onload = function(event) {
              var contents = event.target.result;
              var numberArray = contents.split("\n").map(Number);
              /* When I do this, the array always terminates with a zero. (I can't find
              documentation on this. But I think that if the last character of a string is
              a separator, the method will return an empty array element after that separator.
              Then the Number constructor returns "0" for that empty element. Maybe.) */
              if (contents.endsWith("\n")) {
                numberArray.pop();
              }
              inversionCounter = 0;
              inversionOutput.textContent = "Number of inversions: " + countInversions(numberArray);
            };
            reader.readAsText(file);
        }
      });
  } else {
    // Need to change this to replace HTML instead of logging to console.
    console.log("Your browser does not support File API.");
  }
}
