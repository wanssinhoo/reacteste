import React from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Box, ButtonFixedFooterLayout, ButtonSecondary, Text4, ThemeContextProvider, VIVO_NEW_SKIN, getSkinByName, skinVars } from '@telefonica/mistica';
import styles from './styles.module.css';

export default function App() {
  const width = global.window.innerWidth;
  const height = global.window.innerHeight;
  const aspectRatio = width / height;
  let deviceId: any;

  const onNewScanResult = (decodedText: string) => {
    window.alert(decodedText);
  }

  const handleStartScanning = async (html5QrCode: Html5Qrcode) => {
    const userAgent = navigator.userAgent;
    let config: any;

    if(userAgent.match(/iphone/gi)){

      config = {
          fps: 10,
          videoConstraints: {
            facingMode: 'environment',
            aspectRatio,
            zoom: 4,
          },
        };

      const videoStream = await window.navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          aspectRatio,
        },
        audio: false,
      });

      deviceId = videoStream.getVideoTracks()[0].id;
      videoStream.getTracks().forEach(track => track.stop());
    } else {

      config = {
        fps: 10,
        aspectRatio,
        videoConstraints: {
          facingMode: 'environment',
          autoGainControl: true,
          zoom: 2,
        },
      };
    
      let devices = await window.navigator.mediaDevices.enumerateDevices();
      let videoDevices: Array<MediaDeviceInfo> = [];

      devices.forEach((device: MediaDeviceInfo) => {
        if (device.label.match(/back/gi) ) {
          videoDevices.push(device);
        }
      });

      // if(videoDevices.length == 0){
        const videoStream = await window.navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            aspectRatio,
          },
          audio: false,
        });

        deviceId = videoStream.getVideoTracks()[0].id;
        videoStream.getTracks().forEach(track => track.stop());
  
        // window.alert(JSON.stringify( videoStream.getVideoTracks().length));
      // } else {

        // for (let i in videoDevices) {
        //   const device = videoDevices[i];
        //   const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: device.deviceId } } });
        //   stream.getVideoTracks().forEach(track => {
        //     const capabilities = track.getCapabilities();
        //     if(capabilities.focusMode.indexOf("continuous") != -1)
        //       deviceId = capabilities.deviceId;
        //   });
        //   stream.getTracks().forEach(track => track.stop());
        // }
      // }

    }


    try {
      html5QrCode
        .start(
          deviceId,
          config,
          onNewScanResult,
          () => {
            return;
          },
        )
        .catch(() => {
          console.error('VOCÊ NÃO TEM PERMISSÃO');
        });
    } catch {
      if (userAgent.match(/Android/i))
        console.log('ACEITE A PERMISSÃO');
      else {
        console.error('VOCÊ NÃO TEM PERMISSÃO');
      }
    }
  };

  React.useEffect(() => {
    const html5QrCode = new Html5Qrcode('video-area', {
      useBarCodeDetectorIfSupported: true,
      verbose: false,
      formatsToSupport: [Html5QrcodeSupportedFormats.CODE_128],
    });

    handleStartScanning(html5QrCode);

    return () => {
      html5QrCode
        .stop()
        .then(() => {
          return;
        })
        .catch(() => {
          return;
        });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeContextProvider theme={{
      skin: getSkinByName(VIVO_NEW_SKIN),
      colorScheme: 'light',
      i18n: {
        locale: 'pt-BR',
        phoneNumberFormattingRegionCode: 'BR',
      },

    }}>
      <ButtonFixedFooterLayout
        isFooterVisible
        containerBgColor={'#000000'}
        footerBgColor={'#000000'}
        button={
          <ButtonSecondary
            onPress={() => {
            }}
            style={{
              background:
                skinVars.colors.buttonSecondaryBorderInverse,
            }}
          >

            {'Digitar código'}
          </ButtonSecondary>
        }
      >
        <Box className={styles.overlay}>
          <Box className={styles.header}>
            <Box className={styles.info_header}>
              <Text4
                textAlign="center"
                medium
                color={skinVars.colors.textPrimaryInverse}
              >
                {`Leitura`}
              </Text4>
              { <Text4
                textAlign="center"
                medium
                color={skinVars.colors.textPrimaryInverse}
              >
                {'e aguarde a leitura automática'}
              </Text4> }
            </Box>
          </Box>
          <Box className={styles.scanning_area}>
            <div
              id="video-area"
              data-testid="video"
              className={styles.videos}
            />
            <hr
              className={styles.divider}
              style={{
                backgroundColor: `${skinVars.colors.buttonPrimaryBackground}`,
                borderColor: `${skinVars.colors.buttonPrimaryBackground}`,
              }}
            />
          </Box>
        </Box>
      </ButtonFixedFooterLayout>
    </ThemeContextProvider>
  );
}
