import React from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Box, ButtonFixedFooterLayout, ButtonSecondary, Text4, ThemeContextProvider, VIVO_NEW_SKIN, getSkinByName, skinVars } from '@telefonica/mistica';
import styles from './styles.module.css';

export default function App() {
  const width = global.window.innerWidth;
  const height = global.window.innerHeight;
  const aspectRatio = width / height;
  // let deviceId: any;

  const onNewScanResult = (decodedText: string) => {
    window.alert(decodedText);
  }

  const cameraSelectorHandler = async (videoDevices: any): Promise<string | null> => {
    let deviceId: any;
    try {
        if (videoDevices.length === 0) {
            const videoStream = await window.navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    // aspectRatio,
                },
                audio: false,
            });

            deviceId = videoStream.getVideoTracks()[0].id;
            videoStream.getTracks().forEach(track => track.stop());
        } else {
            for (let i in videoDevices) {
                const device = videoDevices[i];
                const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: device.deviceId } } });
                stream.getVideoTracks().forEach(track => {
                    const capabilities = track.getCapabilities();
                    if (capabilities.focusMode.indexOf("continuous") != -1)
                        deviceId = capabilities.deviceId;
                });
                stream.getTracks().forEach(track => track.stop());
            }
        }
    } catch (e) {
        return null;
    }
    return deviceId;
}

const handleStartScanning = async (html5QrCode: Html5Qrcode) => {
    let deviceId;
    let config: any = {
        fps: 10,
    };


    const userAgent = navigator.userAgent;
    const videoDevices: Array<MediaDeviceInfo> = [];

    const devices = await window.navigator.mediaDevices.enumerateDevices();
    devices.forEach((device: MediaDeviceInfo) => {
        if (device.label.match(/back/gi)) videoDevices.push(device);
    });

    console.error('VIDEO: ', videoDevices);

    if (userAgent.match(/iphone/gi)) {
        const videoStream = await window.navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment',
                // aspectRatio,
            },
            audio: false,
        });
        deviceId = videoStream.getVideoTracks()[0].id;
    }
    else
        deviceId = await cameraSelectorHandler(videoDevices);


    if (userAgent.match(/iphone/gi)) {
        config = {
            ...config,
            videoConstraints: {
                aspectRatio,
                facingMode: 'environment',
                zoom: 4
            }
        }
    }
    else {
        config = {
            ...config,
            aspectRatio,
            videoConstraints: {
                facingMode: 'environment',
                autoGainControl: true,
                zoom: 2,
            } 
        };
    }

  // const handleStartScanning = async (html5QrCode: Html5Qrcode) => {
  //   let deviceId: string | undefined;
  //   const videoDevices: Array<MediaDeviceInfo> = [];
  //   const userAgent = navigator.userAgent;

  //   const config: any = {
  //       fps: 10,
  //       aspectRatio: userAgent.match(/iphone/gi) ? undefined : aspectRatio,
  //       videoConstraints: userAgent.match(/iphone/gi)
  //           ? {
  //                 facingMode: 'environment',
  //                 aspectRatio,
  //                 zoom: 4,
  //             }
  //           : 
  //           {
  //                 facingMode: 'environment',
  //                 autoGainControl: true,
  //                 zoom: 2,
  //             },
  //   };

  //   // window.alert(JSON.stringify( config));

  //   try {
  //     const devices = await window.navigator.mediaDevices.enumerateDevices();

  //     devices.forEach((device: MediaDeviceInfo) => {
  //         if (device.label.match(/back/gi)) videoDevices.push(device);
  //     });

  //     if(videoDevices.length === 0){
  //       const videoStream =
  //       await window.navigator.mediaDevices.getUserMedia({
  //           video: {
  //             facingMode: "environment"
  //           },
  //           audio: false,
  //       });
  
  //       // window.alert(JSON.stringify( videoStream.getVideoTracks().length));
  //       deviceId = videoStream.getVideoTracks()[0].getCapabilities().deviceId;
  //       videoStream.getTracks().forEach((track) => track.stop());
  //     } else {

  //       for (const i in videoDevices) {
  //         const device = videoDevices[i];
  //         const stream = await navigator.mediaDevices.getUserMedia({
  //             video: { deviceId: { exact: device.deviceId } },
  //         });
  //         stream.getVideoTracks().forEach((track) => {
  //             const capabilities = track.getCapabilities();
  //             if (capabilities.focusMode.indexOf('continuous') != -1)
  //                 deviceId = capabilities.deviceId;
  //         });
  //         stream.getTracks().forEach((track) => track.stop());
  //       }
  //     }

  //   } catch {
  //     window.alert("ERRO");
  //   }

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