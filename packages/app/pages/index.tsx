import React, { useEffect } from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { LandingPage } from "@dewo/app/containers/landingPage/LandingPage";
import { useRequestSigner } from "@dewo/app/util/ethereum";
import Safe, { EthersAdapter } from "@gnosis.pm/safe-core-sdk";
import { ethers } from "ethers";

const Testing = () => {
  const requestSigner = useRequestSigner();

  useEffect(() => {
    (async () => {
      const signer = await requestSigner();
      const ethAdapter = new EthersAdapter({ ethers, signer });

      const safeAddress = "0xB815C4f62feA90e81032fe4AF7F094534DDb4784";
      const safeSdk = await Safe.create({ ethAdapter, safeAddress });

      const balance = await safeSdk.getBalance();
      const owners = await safeSdk.getOwners();
      const threshold = await safeSdk.getThreshold();
      console.warn({
        balance,
        owners,
        threshold,
        data: "0xwatafak should be here",
      });

      const tx = await safeSdk.createTransaction([
        {
          to: "0x761996F7258A19B6aCcF6f22e9Ca8CdAA92D75A6",
          value: ethers.utils.parseEther("0.001").toString(),
          // TODO(fant): figure out what this is... Should it refer to e.g. the Dework task id?
          // data: `0x${"watafak should be here"}`,
          data: "0x761996F7258A19B6aCcF6f22e9Ca8CdAA92D75A6",
        },
      ]);

      console.warn("created tx");

      // await safeSdk.signTransaction(tx);
      // await safeSdk.signTransaction(tx);

      const txHash = await safeSdk.getTransactionHash(tx);
      console.warn({ tx, txHash });

      // const response = await safeSdk.approveTransactionHash(txHash);
      // console.warn({ response });

      const executeTxResponse = await safeSdk.executeTransaction(tx);
      console.warn({ executeTxResponse });

      /*
      const transactions: SafeTransactionDataPartial[] = [{
  to: '0x<address>',
  value: '<eth_value_in_wei>',
  data: '0x<data>'
}]
const safeTransaction = await safeSdk.createTransaction(...transactions)
      
      */

      // const tx = await adapter.create
      // console.warn("signer", signer, adapter);
    })();
  }, []);

  return null;
};

const Page: NextPage = () => {
  return (
    <Layout>
      <Sidebar />
      <Layout.Content>
        <LandingPage />
        {typeof window !== "undefined" && <Testing />}
      </Layout.Content>
    </Layout>
  );
};

export default Page;
