import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import ProfileField from '../components/dashboard/others/ProfileField';
import { Header } from '../components/dashboard/others/Header';
import { useUser } from "../components/user/UserContext";

interface ProfileProps {
    name: string;
    manager: string;
    employeeId: string;
    supervisoryOrganization: string;
    phone: string;
    company: string;
    email: string;
    location: string;
    businessTitle: string;
    skills: string[];
    jobProfile: string;
    employeeType: string;
    hireDate: string;
}

function ProfileComponent(props: ProfileProps) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    {props.name}
                </Typography>
                <ProfileField label="Employee ID" value={props.employeeId} />
                <ProfileField label="Manager" value={props.manager} />
                <ProfileField label="Supervisory Organization" value={props.supervisoryOrganization} />
                <ProfileField label="Phone Number" value={props.phone} />
                <ProfileField label="Company" value={props.company} />
                <ProfileField label="Email" value={props.email} />
                <ProfileField label="Location" value={props.location} />
                <ProfileField label="Business Title" value={props.businessTitle} />
                <ProfileField label="Skills" value={props.skills} />
                <ProfileField label="Job Profile" value={props.jobProfile} />
                <ProfileField label="Employee Type" value={props.employeeType} />
                <ProfileField label="Hire Date" value={props.hireDate} />
            </CardContent>
        </Card>
    );
};

export default function Profile() {
    const { user } = useUser();
    return (
        <Box m="20px">
            <Header title="Profile" />
            <ProfileComponent name={user ? user.resource_name : ""}
                manager="Michael Lim"
                employeeId="123456"
                supervisoryOrganization="Sales"
                phone="+65 84821923"
                company="NTT Singapore Pte.Ltd"
                email="john.doe@global.ntt"
                location="SGP, Ubi (SG)"
                businessTitle="L3 Implementation Engineer"
                skills={["Python", "PHP", "MySQL", "Kotlin", "Java", "Ruby"]}
                jobProfile="L3 Implementation Engineer"
                employeeType="Permanent"
                hireDate="2020-01-01"
            />
        </Box>
    );
}