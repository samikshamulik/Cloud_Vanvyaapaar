import xml.etree.ElementTree as ET

xml_content = """<mxfile host="app.diagrams.net">
  <diagram id="dGHLB2MKFyiSDLTvy6aQ" name="AWS-Multi-AZ-Split">
    <mxGraphModel dx="1600" dy="1600" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1654" pageHeight="2200" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
"""

def add_cell(id, value, style, parent, x, y, w, h):
    global xml_content
    v = value.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;').replace('\n', '&#xa;')
    xml_content += f"""        <mxCell id="{id}" parent="{parent}" style="{style}" value="{v}" vertex="1">
          <mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry" />
        </mxCell>\n"""

def add_edge(id, source, target, style="", value="", waypoints=[]):
    global xml_content
    v = value.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;').replace('\n', '&#xa;')
    pts_str = ""
    if waypoints:
        pts_str = "<Array as=\"points\">" + "".join([f"<mxPoint x=\"{p[0]}\" y=\"{p[1]}\" />" for p in waypoints]) + "</Array>"
    xml_content += f"""        <mxCell id="{id}" parent="1" style="edgeStyle=orthogonalEdgeStyle;{style}" edge="1" source="{source}" target="{target}" value="{v}">
          <mxGeometry relative="1" as="geometry">{pts_str}</mxGeometry>
        </mxCell>\n"""

style_group = "points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];shape=mxgraph.aws4.group;"
style_aws_cloud = style_group + "grIcon=mxgraph.aws4.group_aws_cloud_alt;strokeColor=#232F3E;fillColor=none;verticalLabelPosition=top;verticalAlign=bottom;align=center;html=1;fontSize=14;fontStyle=1;"
style_vpc = style_group + "grIcon=mxgraph.aws4.group_vpc;strokeColor=#8C4FFF;fillColor=none;verticalLabelPosition=top;verticalAlign=bottom;align=center;html=1;fontSize=12;fontStyle=1;"
style_az = style_group + "grIcon=mxgraph.aws4.group_region;strokeColor=#147EBA;fillColor=none;dashed=1;verticalLabelPosition=top;verticalAlign=bottom;align=center;html=1;fontSize=12;fontStyle=1;"
style_pub_sub = style_group + "grIcon=mxgraph.aws4.group_public_subnet;strokeColor=#007CBB;fillColor=#E6F2F8;verticalLabelPosition=top;verticalAlign=bottom;align=center;html=1;fontSize=11;"
style_pri_sub = style_group + "grIcon=mxgraph.aws4.group_private_subnet;strokeColor=#067F68;fillColor=#E6F5F2;verticalLabelPosition=top;verticalAlign=bottom;align=center;html=1;fontSize=11;"
style_iso_sub = style_group + "grIcon=mxgraph.aws4.group_private_subnet;strokeColor=#D13212;fillColor=#FCECE8;verticalLabelPosition=top;verticalAlign=bottom;align=center;html=1;fontSize=11;"
style_asg = style_group + "grIcon=mxgraph.aws4.group_auto_scaling_group;strokeColor=#D86613;fillColor=none;dashed=1;verticalLabelPosition=top;verticalAlign=bottom;align=center;html=1;fontSize=11;fontStyle=1;"

style_icon = "outlineConnect=0;fontColor=#232F3E;gradientColor=none;strokeColor=none;labelBackgroundColor=#ffffff;align=center;html=1;fontSize=11;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;verticalLabelPosition=bottom;verticalAlign=top;"
icon_r53 = style_icon + "resIcon=mxgraph.aws4.route_53;fillColor=#8C4FFF;"
icon_cf = style_icon + "resIcon=mxgraph.aws4.cloudfront;fillColor=#8C4FFF;"
icon_s3 = style_icon + "resIcon=mxgraph.aws4.s3;fillColor=#3F8624;"
icon_igw = style_icon + "resIcon=mxgraph.aws4.internet_gateway;fillColor=#8C4FFF;"
icon_alb = style_icon + "resIcon=mxgraph.aws4.application_load_balancer;fillColor=#8C4FFF;"
icon_nat = style_icon + "resIcon=mxgraph.aws4.nat_gateway;fillColor=#8C4FFF;"
icon_ec2 = style_icon + "resIcon=mxgraph.aws4.ec2;fillColor=#ED7100;"
icon_bastion = icon_ec2 
icon_rds = style_icon + "resIcon=mxgraph.aws4.rds;fillColor=#3334DC;"
icon_iam = style_icon + "resIcon=mxgraph.aws4.role;fillColor=#DD344C;"
icon_secrets = style_icon + "resIcon=mxgraph.aws4.secrets_manager;fillColor=#DD344C;"
icon_users = style_icon + "resIcon=mxgraph.aws4.user;fillColor=#232F3E;"

style_text = "text;html=1;strokeColor=#FF8000;fillColor=#fff2cc;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=1;fontSize=12;"
style_text_plain = "text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=12;fontStyle=1;"

# Title
add_cell("title", "VanVyaapaar - Multi-AZ Highly Available Architecture (Split Frontend/Backend)", "text;html=1;strokeColor=none;fontSize=24;fontStyle=1;", "1", 200, 10, 1000, 50)

# AWS Cloud
add_cell("aws", "AWS Cloud", style_aws_cloud, "1", 10, 80, 1400, 1850)

# Flow users
add_cell("users", "Global Users", icon_users, "1", 300, 130, 60, 60)
add_cell("r53", "Route 53 (DNS)", icon_r53, "1", 500, 130, 60, 60)
add_cell("cf", "CloudFront (CDN)", icon_cf, "1", 680, 130, 60, 60)
add_cell("s3", "S3 Bucket\n(Static Assets & Images)", icon_s3, "1", 550, 220, 60, 60)

# VPC & AZs
add_cell("vpc", "VPC", style_vpc, "1", 100, 310, 1200, 1550)
add_cell("az1", "Availability Zone 1 (US-East-1a)", style_az, "1", 130, 370, 550, 1450)
add_cell("az2", "Availability Zone 2 (US-East-1b)", style_az, "1", 720, 370, 550, 1450)

# Tier 1 (Public Subnets)
add_cell("pub1", "Public Subnet 1\n(Tier 1)", style_pub_sub, "1", 150, 420, 510, 380)
add_cell("pub2", "Public Subnet 2\n(Tier 1)", style_pub_sub, "1", 740, 420, 510, 380)

add_cell("igw", "Internet Gateway", icon_igw, "1", 1050, 280, 60, 60)
add_cell("ext_alb", "External ALB\n(Routes to Frontend)", icon_alb, "1", 670, 450, 60, 60)
add_cell("sg1", "Internet -> ALB (Port 443/80)", style_text, "1", 850, 450, 200, 30)

add_cell("nat1", "NAT Gateway 1", icon_nat, "1", 200, 470, 60, 60)
add_cell("nat2", "NAT Gateway 2", icon_nat, "1", 1150, 470, 60, 60)
add_cell("bastion", "Bastion Host", icon_bastion, "1", 300, 470, 60, 60)

# Frontend ASG & EC2s (inside Public Subnets)
add_cell("front_asg", "Frontend Auto Scaling Group", style_asg, "1", 280, 550, 840, 220)
add_cell("front_asg_lbl", "Scaling Policy: CPU / Request Count", style_text_plain, "1", 600, 555, 230, 30)

add_cell("f_ec2_1", "Frontend EC2\n(React :3000)", icon_ec2, "1", 380, 620, 60, 60)
add_cell("f_ec2_2", "Frontend EC2\n(React :3000)", icon_ec2, "1", 960, 620, 60, 60)
add_cell("sg2", "ALB -> Frontend (Port 3000)", style_text, "1", 610, 520, 180, 30)


# Tier 2 (Private Subnets)
add_cell("pri1", "Private App Subnet 1\n(Tier 2)", style_pri_sub, "1", 150, 830, 510, 480)
add_cell("pri2", "Private App Subnet 2\n(Tier 2)", style_pri_sub, "1", 740, 830, 510, 480)

add_cell("int_alb", "Internal ALB\n(Routes to Backend)", icon_alb, "1", 670, 870, 60, 60)
add_cell("sg3", "Frontend -> Internal ALB (Port 80/8080)", style_text, "1", 350, 870, 240, 30)

# Backend ASG & EC2s (inside Private Subnets)
add_cell("back_asg", "Backend Auto Scaling Group", style_asg, "1", 280, 970, 840, 220)
add_cell("back_asg_lbl", "Scaling Policy: CPU limits", style_text_plain, "1", 600, 975, 230, 30)

add_cell("b_ec2_1", "Backend EC2\n(Spring Boot :8080)", icon_ec2, "1", 380, 1040, 60, 60)
add_cell("b_ec2_2", "Backend EC2\n(Spring Boot :8080)", icon_ec2, "1", 960, 1040, 60, 60)
add_cell("sg4", "ALB -> Backend (Port 8080)", style_text, "1", 610, 940, 180, 30)

add_cell("iam", "IAM Role\n(S3, Secrets Access)", icon_iam, "1", 180, 1050, 60, 60)
add_cell("secrets", "AWS Secrets Manager\n(DB Credentials)", icon_secrets, "1", 670, 1200, 60, 60)


# Tier 3 (Isolated DB Subnets)
add_cell("iso1", "Isolated DB Subnet 1\n(Tier 3)", style_iso_sub, "1", 150, 1340, 510, 300)
add_cell("iso2", "Isolated DB Subnet 2\n(Tier 3)", style_iso_sub, "1", 740, 1340, 510, 300)

add_cell("rds1", "Amazon RDS\n(MySQL Primary)", icon_rds, "1", 380, 1420, 60, 60)
add_cell("rds2", "Amazon RDS\n(MySQL Standby)", icon_rds, "1", 960, 1420, 60, 60)
add_cell("sg5", "Backend -> RDS (Port 3306)", style_text, "1", 350, 1310, 180, 30)


# CI/CD Flow
add_cell("cicd", "<b>CI/CD Pipeline</b><br><br>GitHub &rarr; Jenkins &rarr; Docker Build &rarr; Amazon ECR &rarr; ECS/EC2 Deploy", "rounded=1;whiteSpace=wrap;html=1;strokeColor=#147EBA;fillColor=#E6F2F8;fontSize=14;fontStyle=0;", "1", 100, 1960, 1200, 80)

# Connectors
add_edge("e_r53_cf", "r53", "cf", "strokeColor=#8C4FFF;", "CDN request")
add_edge("e_cf_s3", "cf", "s3", "dashed=1;strokeColor=#3F8624;", "Fetch Images")
add_edge("e_r53_igw", "r53", "igw", "strokeColor=#8C4FFF;", "Traffic")
add_edge("e_igw_alb", "igw", "ext_alb", "strokeColor=#8C4FFF;")

add_edge("e_ealb_ec2_1", "ext_alb", "f_ec2_1", "dashed=1;")
add_edge("e_ealb_ec2_2", "ext_alb", "f_ec2_2", "dashed=1;")

add_edge("e_pub_int_alb_1", "f_ec2_1", "int_alb", "dashed=1;")
add_edge("e_pub_int_alb_2", "f_ec2_2", "int_alb", "dashed=1;")

add_edge("e_ialb_ec2_1", "int_alb", "b_ec2_1", "dashed=1;")
add_edge("e_ialb_ec2_2", "int_alb", "b_ec2_2", "dashed=1;")

add_edge("e_back_rds_1", "b_ec2_1", "rds1")
add_edge("e_back_rds_2", "b_ec2_2", "rds2")
add_edge("e_rds_repl", "rds1", "rds2", "startArrow=classic;endArrow=classic;dashed=1;", "Replication Sync")

add_edge("e_back_nat_1", "b_ec2_1", "nat1", "dashed=1;strokeColor=#8C4FFF;", "Outbound")
add_edge("e_back_nat_2", "b_ec2_2", "nat2", "dashed=1;strokeColor=#8C4FFF;", "Outbound")
add_edge("e_nat1_igw", "nat1", "igw", "dashed=1;strokeColor=#8C4FFF;")
add_edge("e_nat2_igw", "nat2", "igw", "dashed=1;strokeColor=#8C4FFF;")

add_edge("e_back_secrets1", "b_ec2_1", "secrets", "dashed=1;strokeColor=#DD344C;")
add_edge("e_back_secrets2", "b_ec2_2", "secrets", "dashed=1;strokeColor=#DD344C;")

add_edge("e_back_s3_1", "b_ec2_1", "s3", "dashed=1;strokeColor=#3F8624;", "Store/Fetch Media")
add_edge("e_back_s3_2", "b_ec2_2", "s3", "dashed=1;strokeColor=#3F8624;")


with open('vanvyaapaar-aws-architecture.drawio', 'w', encoding='utf-8') as f:
    f.write(xml_content + "      </root>\n    </mxGraphModel>\n  </diagram>\n</mxfile>")

print("Architecture Diagram Draw.io generated successfully!")
