import Layout from '@/components/layout/Layout'
import React, { ReactNode } from 'react'

const layout = ({ children }: { children: ReactNode }) => {
    return (
        <Layout footerStyle={1}>
            <div>
                <section className="box-section box-breadcrumb background-body">
                    {children}
                </section>
            </div>
        </Layout>

    )
}

export default layout
