import { Skeleton, SkeletonCircle, SkeletonText, Stack, Box } from '@chakra-ui/react';
import React, { useState } from "react"
export const SkeletonE = () => {
  return (
    <Stack padding={4} spacing={1} marginLeft={"10px"} marginRight={"10px"} margin={"auto"}>
      <Skeleton
        height='180px'
        isLoaded={isLoaded} >
      </Skeleton>
      <Skeleton
        height='180px'
        isLoaded={isLoaded}
        mb={"10px"}
        bg='green.500'
        color='white'
        fadeDuration={1}
      >
      </Skeleton>
      <Skeleton
        height='180px'
        isLoaded={isLoaded}
        mb={"10px"}
        fadeDuration={4}
        bg='blue.500'
        color='white'
      >
      </Skeleton>
      <Skeleton
        height='180px'
        isLoaded={isLoaded}
        mb={"10px"}
        fadeDuration={4}
        bg='blue.500'
        color='white'
      >
      </Skeleton>
      <Skeleton
        height='180px'
        isLoaded={isLoaded}
        mb={"10px"}
        fadeDuration={4}
        bg='blue.500'
        color='white'
      >
      </Skeleton>
    </Stack>
  )
}