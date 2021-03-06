var fs = require('fs');
var es = require('elasticsearch');
var client = new es.Client({
  host: 'localhost:9200'
});

fs.readFile('cdcinfo_dev_data_modified.json', {encoding: 'utf-8'}, function(err, data) {
  if (err) { throw err; }

  var content =  JSON.parse(data);
  content = content.List;

  // Build up a giant bulk request for elasticsearch.
  bulk_request = content.reduce(function(bulk_request, line) {

    // console.log(line);
    var obj, recipe;

    try {
      obj = line;
    } catch(e) {
      // console.log(e);
      console.log('Done reading');
      return bulk_request;
    }

    // Rework the data slightly
    recipe = {
      id: obj.Id, 
      number: obj.Number,
      query: obj.Query,
      response: obj.Response,
      keywords: obj.Keywords,
      language: obj.Language,
      tier: obj.Tier,
      gender: obj.Gender,
      readingLevel: obj.ReadingLevel,
      readingLevelScore: obj.ReadingLevelScore,
      center: obj.Center,
      program: obj.Program,
      category: obj.Category,
      topic: obj.Topic,
      subtopic: obj.Subtopic,
      smartTag: obj.SmartTag,
      probes: obj.Probes,
      resources: obj.Resources,
      callToAction: obj.CallToAction,
      background: obj.Background
    };

    bulk_request.push({index: {_index: 'prepared_responses', _type: 'prepared_responses', _id: recipe.id}});
    bulk_request.push(recipe);
    return bulk_request;
  }, []);

  // A little voodoo to simulate synchronous insert
  var busy = false;
  var callback = function(err, resp) {
    if (err) { console.log(err); }

    busy = false;
  };

  // Recursively whittle away at bulk_request, 1000 at a time.
  var perhaps_insert = function(){
    if (!busy) {
      busy = true;
      client.bulk({
        body: bulk_request.slice(0, 1000)
      }, callback);
      bulk_request = bulk_request.slice(1000);
      console.log(bulk_request.length);
    }

    if (bulk_request.length > 0) {
      setTimeout(perhaps_insert, 10);
    } else {
      console.log('Inserted all records.');
    }
  };

  perhaps_insert();
});