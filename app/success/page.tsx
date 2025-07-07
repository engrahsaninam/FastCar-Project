"use client"

import { Box, Button, Text, Heading, Icon, VStack, Circle } from "@chakra-ui/react"
import { Check } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useGetInspectionSuccess } from "@/services/cars/useCars"

export default function PaymentSuccess() {
    const router = useRouter()
    const searchParams = useSearchParams() ?? new URLSearchParams()
    const sessionId = searchParams.get("session_id")
    console.log("sessionId", sessionId)
    const { data } = useGetInspectionSuccess(sessionId || "")
    console.log("data", data)
    return (
        <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
            <Box bg="white" maxW="sm" w="full" borderRadius="2xl" boxShadow="2xl" borderWidth="1px" p={8}>
                <VStack spacing={6}>
                    <Circle size="64px" bg="green.100">
                        <Icon as={Check} w={10} h={10} color="green.600" strokeWidth={3} />
                    </Circle>
                    <Box textAlign="center">
                        <Heading size="lg" color="gray.900">Payment succeeded!</Heading>
                        <Text mt={2} color="gray.600">
                            Thank you for processing your most recent payment. Your premium subscription will expire on June 2, 2024.
                        </Text>
                    </Box>
                    {/* Inspection Status */}
                    {/* {isLoading && <Text color="gray.500">Checking inspection status...</Text>} */}
                    {/* <Text color="red.500">Failed to fetch inspection status.</Text> */}

                    <Button
                        mt={4}
                        colorScheme="red"
                        w="full"
                        onClick={() => router.push("/checkout")}
                    >
                        Back to checkout
                    </Button>
                </VStack>
            </Box>
        </Box>
    )
}