import { parseSelector } from '../src/dom/querySelector';

describe('querySelector', () => {

  it('parse classes, id, descendants and children expressions', async done => {
    const r = parseSelector('.class1 #id2>[foo=bar]')
    expect(r).toEqual([
      {
        "name": "classes",
        "value": "class1",
        "operator": "contains",
        "type": "class",
        "descendants": [
          {
            "name": "id",
            "value": "id2",
            "operator": "equals",
            "type": "id",
            "children": [
              {
                "name": "foo",
                "type": "prop",
                "value": "bar",
                "operator": "equals"
              }
            ]
          }
        ]
      }
    ])
    done()
  })

  it('parse name with @ and arbitrary properties', async done => {
    const r = parseSelector('@button2 [foo~bar]')
    // console.log(r);

    expect(r).toEqual([
      {
        "name": "name",
        "value": "button2",
        "operator": "equals",
        "type": "name",
        "descendants": [
          {
            "name": "foo",
            "value": "bar",
            "operator": "contains",
            "type": "prop"
          }
        ]
      }
    ])
    done()
  })

  it('should parse a complex query with descendant, parent, children, ancestor, and logic', async done => {


    const expected =
      [
        {
          "name": "id",
          "value": "sdf",
          "operator": "equals",
          "type": "id",
          "children": [
            {
              "name": "ddf",
              "value": true,
              "operator": "equals",
              "descendants": [
                {
                  "name": "id",
                  "value": "ff",
                  "operator": "equals",
                  "type": "id",
                  "nextSibling": [
                    {
                      "name": "rf",
                      "type": "prop",
                      "value": 12,
                      "operator": "contains",
                      "descendants": [
                        {
                          "name": "a",
                          "type": "prop",
                          "value": 2,
                          "operator": "equals"
                        },
                        {
                          "name": "b",
                          "type": "prop",
                          "value": 3,
                          "operator": "equals",
                          "parentAggregation": "and",
                          "prevSibling": [
                            {
                              "name": "r",
                              "type": "prop",
                              "value": 8,
                              "operator": "equals",
                              "ancestor": [
                                {
                                  "name": "classes",
                                  "value": "jj",
                                  "operator": "contains",
                                  "type": "class"
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]

    const r = parseSelector('#sdf>ddf #ff+rf~12 [a=2&b=3]-[r=8]^.jj')
    expect(r).toEqual(expected)
    done()
  })

})
