<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0" xmlns:sld="http://www.opengis.net/sld">
  <UserLayer>
    <sld:LayerFeatureConstraints>
      <sld:FeatureTypeConstraint/>
    </sld:LayerFeatureConstraints>
    <sld:UserStyle>
      <sld:Name>WP</sld:Name>
      <sld:FeatureTypeStyle>
        <sld:Rule>
          <sld:RasterSymbolizer>
            <sld:ChannelSelection>
              <sld:GrayChannel>
                <sld:SourceChannelName>1</sld:SourceChannelName>
              </sld:GrayChannel>
            </sld:ChannelSelection>
            <sld:ColorMap type="ramp">
              <sld:ColorMapEntry quantity="0.015113454312086105" color="#fff5f0" label="0.0151"/>
              <sld:ColorMapEntry quantity="0.11195691753178835" color="#fee0d2" label="0.1120"/>
              <sld:ColorMapEntry quantity="0.2088003807514906" color="#fcbba1" label="0.2088"/>
              <sld:ColorMapEntry quantity="0.30564384397119282" color="#fc9272" label="0.3056"/>
              <sld:ColorMapEntry quantity="0.40248730719089509" color="#fb6a4a" label="0.4025"/>
              <sld:ColorMapEntry quantity="0.49933077041059731" color="#ef3b2c" label="0.4993"/>
              <sld:ColorMapEntry quantity="0.59617423363029953" color="#cb181d" label="0.5962"/>
              <sld:ColorMapEntry quantity="0.68556819967925553" color="#a50f15" label="0.6856"/>
              <sld:ColorMapEntry quantity="0.76006317138671875" color="#67000d" label="0.7601"/>
            </sld:ColorMap>
          </sld:RasterSymbolizer>
        </sld:Rule>
      </sld:FeatureTypeStyle>
    </sld:UserStyle>
  </UserLayer>
</StyledLayerDescriptor>
