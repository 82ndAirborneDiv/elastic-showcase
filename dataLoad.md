Elaasticsearch Clean Setup Process
==================================

1. Create empty index:

curl -XPUT 'localhost:9200/en_wikipedia/'

2. Close the index:

curl -XPOST 'localhost:9200/en_wikipedia/_close'

3. Add mapping: 

curl -XPUT 'http://localhost:9200/en_wikipedia/_mapping/article' -d '
{
  
    "properties": {
     
      "text": {
        "type": "string",
        "fields": {
          "en": {
            "type": "string",
            "analyzer": "english"
          }
        }
      },
      "title": {
        "type": "string",
        "fields": {
          "en": {
            "type": "string",
            "analyzer": "english"
          }
        }
      }
    }
  
}'

4. Open index:

curl -XPOST 'localhost:9200/en_wikipedia/_open'

5. Create alias for index:

curl -XPUT 'localhost:9200/wikipedia/_alias/elastic-showcase'

6. Load wikipedia data with the following command:

java  -Djdk.xml.totalEntitySizeLimit=2147480000 -jar ./stream2es wiki --target http://localhost:9200/wikipedia --log debug --source /Users/michaelta/Downloads/enwiki-latest-pages-articles.xml.bz2 